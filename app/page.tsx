"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import abi from '../lib/abi.json';
import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">🎰 Lottery</h1>
          <p className="text-muted-foreground text-sm">New winner every 30 seconds</p>
          <div className = 'flex justify-center items-center'>
          <ConnectButton/>
          </div>
        </div>

        {/* Enter Raffle */}
        <Card className="p-6">
            {entranceFeeBigInt && (
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Entrance Fee: </span>
                <span className="font-semibold">{formatEther(entranceFeeBigInt)} ETH</span>
              </div>
            )}
            
            <Input
              placeholder={entranceFeeBigInt ? formatEther(entranceFeeBigInt) : "0.01"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              step="0.001"
            />
              
            <Button 
              onClick={handleEnterRaffle}
              disabled={!isConnected || isEntering || !amount}
              className="w-full"
            >
              {isEntering ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Entering...
                </>
              ) : (
                "Enter Lottery"
              )}
            </Button>
        {recentWinnerString && recentWinnerString !== "0x0000000000000000000000000000000000000000" && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Winner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-sm bg-muted p-2 rounded break-all">
                {recentWinnerString}
              </p>
            </CardContent>
          </Card>
        )}
        </Card>
        </div>
    </div>
    );
  }