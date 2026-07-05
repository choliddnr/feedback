// server/utils/image.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { H3Event } from 'h3';
import { saveImg, getImg, deleteImg } from './image';

// Mock R2Bucket type for testing purposes
type R2Bucket = {
  put: vi.Fn;
  get: vi.Fn;
  delete: vi.Fn;
};

// Mock the H3 createError function. It's called by the functions under test.
const mockCreateError = vi.fn(err => {
  throw err;
});
vi.mock('h3', async importOriginal => {
  const original = await importOriginal<typeof import('h3')>();
  return {
    ...original,
    createError: mockCreateError,
  };
});

// This must match the un-exported constant in image.ts
const R2_BINDING = 'R2_BUCKET';

// Mock R2 Bucket implementation
const mockR2Bucket: R2Bucket = {
  put: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

// Mock a valid H3Event that includes the Cloudflare R2 binding
const mockEvent = {
  context: {
    cloudflare: {
      env: {
        [R2_BINDING]: mockR2Bucket,
      },
    },
  },
} as unknown as H3Event;

describe('Cloudflare R2 Image Utils', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('saveImg', () => {
    it('should save an image successfully with a specific content type', async () => {
      const file = new Blob(['test-image-data'], { type: 'image/png' });
      const key = 'test-image.png';

      mockR2Bucket.put.mockResolvedValueOnce({} as any);

      const result = await saveImg(mockEvent, file, key);

      expect(mockR2Bucket.put).toHaveBeenCalledWith(key, file, {
        httpMetadata: { contentType: 'image/png' },
      });
      expect(result).toEqual({ success: true });
    });

    it('should default to application/octet-stream if file type is unknown', async () => {
      const file = new Blob(['test-binary-data'], { type: '' });
      const key = 'test-file.bin';

      await saveImg(mockEvent, file, key);

      expect(mockR2Bucket.put).toHaveBeenCalledWith(key, file, {
        httpMetadata: { contentType: 'application/octet-stream' },
      });
    });

    it('should throw a createError if the R2 put operation fails', async () => {
      const file = new Blob(['test-image-data'], { type: 'image/png' });
      const key = 'test-image.png';
      const errorMessage = 'R2 is down';

      mockR2Bucket.put.mockRejectedValueOnce(new Error(errorMessage));

      const expectedError = {
        statusCode: 500,
        statusMessage: `Failed to upload image: ${errorMessage}`,
      };

      await expect(saveImg(mockEvent, file, key)).rejects.toEqual(expectedError);
      expect(mockCreateError).toHaveBeenCalledWith(expectedError);
    });
  });

  describe('getImg', () => {
    it('should retrieve an image successfully', async () => {
      const key = 'test-image.png';
      const mockR2Object = {
        body: new ReadableStream(),
        httpEtag: 'test-etag-123',
        writeHttpMetadata: (headers: Headers) => {
          headers.set('content-type', 'image/png');
        },
      };

      mockR2Bucket.get.mockResolvedValueOnce(mockR2Object as any);

      const response = await getImg(mockEvent, key);

      expect(mockR2Bucket.get).toHaveBeenCalledWith(key);
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('image/png');
      expect(response.headers.get('etag')).toBe('test-etag-123');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');
    });

    it('should throw a 404 createError if the image is not found', async () => {
      const key = 'not-found.png';
      mockR2Bucket.get.mockResolvedValueOnce(null);

      const expectedError = {
        statusCode: 404,
        statusMessage: 'Image not found',
      };

      await expect(getImg(mockEvent, key)).rejects.toEqual(expectedError);
      expect(mockCreateError).toHaveBeenCalledWith(expectedError);
    });
  });

  describe('deleteImg', () => {
    it('should delete an image successfully', async () => {
      const key = 'test-image.png';
      mockR2Bucket.delete.mockResolvedValueOnce(undefined);

      const result = await deleteImg(mockEvent, key);

      expect(mockR2Bucket.delete).toHaveBeenCalledWith(key);
      expect(result).toEqual({ success: true });
    });

    it('should return an error object if the deletion fails', async () => {
      const key = 'test-image.png';
      const errorMessage = 'Permission denied';
      mockR2Bucket.delete.mockRejectedValueOnce(new Error(errorMessage));

      const result = await deleteImg(mockEvent, key);

      expect(mockR2Bucket.delete).toHaveBeenCalledWith(key);
      expect(result).toEqual({
        success: false,
        error: `Failed to delete image: ${errorMessage}`,
      });
    });
  });

  describe('getBucket (internal)', () => {
    it('should throw an error if R2 binding is not found on the event context', async () => {
      const invalidEvent = {
        context: {
          cloudflare: {
            env: {}, // No binding here
          },
        },
      } as unknown as H3Event;

      const file = new Blob(['']);
      const key = 'any-key';

      // Test the internal getBucket function through one of the exported functions
      // Use .rejects.toThrow for async functions
      await expect(saveImg(invalidEvent, file, key)).rejects.toThrow(
        `R2 binding '${R2_BINDING}' not found.`
      );
    });
  });
});
