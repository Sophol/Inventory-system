"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getQRCodeStats } from "@/lib/actions/serialNumber.action";

interface QRStats {
  inactive: number;
  active: number;
  printed: number;
  currentYear: number;
}

export function QRStats({ productCode }: { productCode: string }) {
  const [stats, setStats] = useState<QRStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await getQRCodeStats(productCode);
      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR Code Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Statistics</CardTitle>
        <CardDescription>Overview of generated QR codes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{stats.inactive}</p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{stats.printed}</p>
            <p className="text-sm text-muted-foreground">Printed</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-purple-600">
              {stats.currentYear}
            </p>
            <p className="text-sm text-muted-foreground">This Year</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
