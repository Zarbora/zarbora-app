import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const projectId = "22644ac4c361f7b743db03b93bf1eac2";

export const metadata = {
  name: "Zarbora",
  description: "A decentralized Zarbora simulation using Harberger taxes",
  url: "https://zarbora.com",
  icons: ["https://zarbora.com/icon.png"],
};

export const config = defaultWagmiConfig({
  chains: [mainnet, sepolia],
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
