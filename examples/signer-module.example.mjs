import { defineSignerModule } from "@mintapi/gateway/client";

export default defineSignerModule({
  preferredNetworks: ["base", "polygon", "solana"],
  signerResolversByFamily: {
    evm: async ({ network }) => {
      throw new Error(`Provide an EVM signer resolver for network: ${network}`);
    },
    svm: async ({ network }) => {
      throw new Error(`Provide an SVM signer resolver for network: ${network}`);
    },
  },
});
