import React from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CardCustom = async () => {
  const products = await fetch(
    "https://2bc46a885a8e.ngrok-free.app/getlowstocks"
  );

  if (!products.ok) {
    throw new Error(`Fetch error: ${products.status}`);
  }

  const res = await products.json();
  console.log(res);
  return (
    <div>
      {res.map((item: any, i: number) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <p>Variants</p>
            <div className="flex gap-2">
              {item.variants.map((innerItem: any, i: number) => (
                <Card className="min-w-1/4" key={i}>
                  <CardTitle>{innerItem.title}</CardTitle>
                  <div>{innerItem.price}</div>
                </Card>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CardCustom;
