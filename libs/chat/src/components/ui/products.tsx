import { useEffect, useState } from "react";
import  { ProductItem, type Product } from "@/chat/components/ui/product";
import { Dot, Input, Text } from "@geist-ui/core"
import { IconCheck, IconCopy, IconDownload } from '@/chat/components/ui/icons'
import { Button } from '@/chat/components/ui/button'

type ProductProps = {
  value: string;
};

export function Products(input: ProductProps) {
  const { value } = input;
  const [isWriting, setIsWriting] = useState(true);
  const [products, setProducts] = useState<Product[]>();
  console.log('products', value);

  // @todo: need to update the json message!

  useEffect(() => {
      console.log('should try',value );
    try {
      const validJSONString = value.replace(/(\w+):/g, '"$1":');

      const ps = JSON.parse(validJSONString)
      console.log('try', ps);
      setProducts(ps);
      setIsWriting(false);
    }
    catch (e) {
      console.warn('e',e );
      setIsWriting(true);
    }
  }, [value]);

  return (
    // <div className="flex flex-col gap-2 w-full bg-background">
    <div className="codeblock relative w-full bg-background font-sans p-2 space-y-2">
      <div className="flex w-full items-center justify-between bg-zinc-800 px-6 py-2 pr-4 text-zinc-100">
        <span className="text-xs lowercase">pasta bolognese:</span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            className="hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
            size="icon"
          >
            <IconDownload />
            <span className="sr-only">Download</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-xs hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
          >
             <IconCheck />
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
      </div>

      {isWriting && <Dot type="warning" style={{ marginRight: '20px' }} className="text-foreground">Thinking...</Dot>}

      {products && products.map((product: Product) => (
        <ProductItem
          product={product}
        />
      ))
      }
    </div>
  )

}


