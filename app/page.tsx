"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import abi from '../lib/abi.json';
import { useState } from "react";
import { formatEther, parseEther } from "viem";
// ICONS: Added Github and Cube for the new buttons
import { Loader2, Trophy, Sparkles, Github, Cuboid } from "lucide-react";

const contractConfig = {
  address: "0x09Fc1017156c44aB4a85EcD87732CFB8bB42bFe5",
  abi: abi,
} as const;

export default function Home() {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");

  const { data: entranceFee } = useReadContract({
    ...contractConfig,
    functionName: "getEntranceFee",
  });

  const { data: recentWinner } = useReadContract({
    ...contractConfig,
    functionName: "getRecentWinner",
  });

  const entranceFeeBigInt = typeof entranceFee === "bigint" ? entranceFee : undefined;
  const recentWinnerString = typeof recentWinner === "string" ? recentWinner : undefined;

  const { writeContract: enterRaffle, isPending: isEntering } = useWriteContract();

  const handleEnterRaffle = () => {
    if (!entranceFee || !amount) return;
    enterRaffle({
      ...contractConfig,
      functionName: "enterRaffle",
      value: parseEther(amount),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left - Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Powered by Chainlink
              </div>
              
              <h1 className="text-6xl font-bold text-foreground leading-tight">
                Fair Lottery
                <span className="block text-primary">Every ~30s*</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Truly random, provably fair lottery using Chainlink VRF. 
                Draws trigger every 30 seconds, but VRF can take 15-20 minutes to pick winners.
              </p>
              
              <p className="text-sm text-muted-foreground italic">
                *Yeah, Chainlink VRF is secure but not exactly speedy lol
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Cryptographically secure randomness</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Automated draws via Chainlink</span>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>100% transparent on-chain</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <a href="https://github.com/ayush18pop/lottery-contract" target="_blank" rel="noopener noreferrer">
                <Button  className="gap-2 w-full sm:w-auto">
                  <Github className="w-4 h-4" />
                  View Code
                </Button>
              </a>
              <a href={`https://sepolia.etherscan.io/address/${contractConfig.address}`} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2 w-full sm:w-auto">
                  <Cuboid className="w-4 h-4" />
                  View Contract
                </Button>
              </a>
            </div>
            {/* END OF NEW SECTION */}

          </div>

          {/* Right - Lottery */}
          <div>
            <Card className="border-border bg-card">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="text-5xl">🎲</div>
                  <h2 className="text-2xl font-bold text-card-foreground">Enter Lottery</h2>
                  <p className="text-sm text-muted-foreground">
                    Winner selection takes 15-20 minutes via VRF
                  </p>
                  <div className="flex justify-center items-center">
                  <ConnectButton />
                  </div>
                  {isConnected && (
                    <div className="space-y-6 pt-4">
                      {entranceFeeBigInt && (
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Entry Fee</div>
                          <div className="text-3xl font-bold text-foreground">
                            {formatEther(entranceFeeBigInt)} ETH
                          </div>
                        </div>
                      )}
                      
                      <Input
                        placeholder={entranceFeeBigInt ? formatEther(entranceFeeBigInt) : "0.01"}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        step="0.001"
                        className="h-14 text-center text-lg bg-input border-border text-foreground"
                      />
                          
                      <Button 
                        onClick={handleEnterRaffle}
                        disabled={!isConnected || isEntering || !amount}
                        className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isEntering ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Entering...
                          </>
                        ) : (
                          "Enter Lottery 🎰"
                        )}
                      </Button>

                      {recentWinnerString && recentWinnerString !== "0x0000000000000000000000000000000000000000" && (
                        <div className="bg-secondary border border-border p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-4 h-4 text-primary" />
                            <span className="font-medium text-secondary-foreground">Latest Winner</span>
                          </div>
                          <p className="font-mono text-sm text-muted-foreground bg-muted p-2 rounded border-border border break-all">
                            {recentWinnerString}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}