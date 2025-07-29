import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/vue'; // make sure to import from better-auth/vue
import type { _auth } from '~/../server/utils/auth';
export const authClient = createAuthClient({
  // you can pass client configuration here
  plugins: [inferAdditionalFields<typeof _auth>()],
});
