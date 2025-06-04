"use client";

import { toast } from "@/hooks/use-toast";
import { generateSerialNumbersAdvanced } from "@/lib/actions/serialNumber.action";
import { generateSerialNumberSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import FormInput from "../formInputs/FormInput";
import { Form } from "../ui/form";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { QRStats } from "../qr-stats";

const GenerateSerialForm = ({ product }: { product: Product }) => {
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  const [serialRange, setSerialRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [serialNumbers, setSerialNumbers] = useState<string[]>([]);
  const [showAllNumbers, setShowAllNumbers] = useState(false);

  const form = useForm<z.infer<typeof generateSerialNumberSchema>>({
    resolver: zodResolver(generateSerialNumberSchema),
    defaultValues: {
      companyCode: "ML",
      productCode: product.code,
      productName: product.title,
      count: 1,
    },
  });

  const handleGenerateSerial = async (
    data: z.infer<typeof generateSerialNumberSchema>
  ) => {
    startTransaction(async () => {
      const result = await generateSerialNumbersAdvanced({ ...data });
      if (result.success && result.data) {
        setSerialRange(result.data.range);
        setSerialNumbers(result.data.serialNumbers);
        toast({
          title: "Success",
          description: "Serial numbers generated successfully.",
        });
        router.push(`/inventories/product/qr/${product._id}`);
      } else {
        toast({
          title: "Error",
          description:
            result.error?.message || "Failed to generate serial numbers.",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="container mx-auto py-10"
        onSubmit={form.handleSubmit(handleGenerateSerial)}
      >
        <Card className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
          <Suspense fallback={<div>Loading...</div>}>
            <QRStats productCode={product.code} />
          </Suspense>
          <CardHeader>
            <CardTitle>Batch Serial Number Generator</CardTitle>
            <CardDescription>Generate multiple serial numbers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <FormInput
                name="companyCode"
                label="Company Code"
                type="text"
                control={form.control}
              />
            </div>
            <div className="space-y-2">
              <FormInput
                name="productCode"
                label="Product Code"
                type="text"
                control={form.control}
              />
            </div>
            <div className="space-y-2">
              <FormInput
                name="productName"
                label="Product Name"
                type="text"
                control={form.control}
              />
            </div>
            <div className="space-y-2">
              <FormInput
                name="count"
                label="Number of Serial Numbers to Generate"
                type="number"
                control={form.control}
              />
            </div>
            {serialRange && (
              <div className="p-4 bg-muted rounded-md space-y-2">
                <div>
                  <p className="text-sm font-medium">Range:</p>
                  <p className="font-mono text-sm">From: {serialRange.start}</p>
                  <p className="font-mono text-sm">To: {serialRange.end}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Generated {serialNumbers.length} serial numbers
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowAllNumbers(!showAllNumbers)}
                  >
                    {showAllNumbers ? "Hide All Numbers" : "Show All Numbers"}
                  </Button>

                  {showAllNumbers && (
                    <div className="mt-2 max-h-60 overflow-y-auto">
                      <ul className="text-xs font-mono space-y-1">
                        {serialNumbers.map((serial, index) => (
                          <li key={index}>{serial}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Generating...
                </>
              ) : (
                "Generate Serial Numbers"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default GenerateSerialForm;
