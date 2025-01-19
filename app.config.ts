export default defineAppConfig({
  ui: {
    primary: "fuel-yellow",
    // primary: "great-blue",
    gray: "zinc",

    // tooltip: {
    //   default: {
    //     openDelay: 500,
    //   },
    // },
    card: {
      shadow: "shadow-md",
      ring: "ring-2",
    },
    notifications: {
      // Show toasts at the top right of the screen
      position: "top-0 bottom-[unset]",
    },
  },
  primary_color: [
    "great-blue",
    "fuel-yellow",
    "astra",
    "pale-sky",
    "flamingo",
    "buttercup",
    "mountain-meadow",
    "dodger-blue",
    "cornflower-blue",
    "french-rose",
  ] as const,
});
