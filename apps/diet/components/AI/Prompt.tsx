import { useState } from "react";
import { Dot, Input, Text } from "@geist-ui/core"
import { CornerDownLeft } from '@geist-ui/icons'
import { sendPrompt } from './ai.utils'
import ProductItem from "@/diet/components/Product/ProductItem";
import { Product } from "@/diet-server/diet.types";

function AIPrompt() {
  const [input, setInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [results, setResults] = useState<any>();

  const onSubmit = async () => {
    setIsFetching(true)
    setResults(undefined)
    const res = await sendPrompt(input)
    console.log('res', res);
    setResults(res)
    setIsFetching(false)
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Input
        width="100%"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        iconRight={
          <CornerDownLeft
            onClick={onSubmit}
          />
        } iconClickable placeholder="Describe meal/product..." />
      {isFetching && <Dot style={{ marginRight: '20px' }}>Thinking...</Dot>}
      {results &&
        <>

          <Text h3>Results</Text>
          <Text p small>** Answer is generated by chatGPT, and is for one serving size...</Text>
          {results.map((product: Product) => (
            <ProductItem
              key={product.id}
              product={product}
              onChange={() => {console.log('change') }}
              onDelete={() => { console.log('delete')}}
              onRestore={() => {console.log('restore') }}
            />
          ))
          }
        </>
      }
    </div>
  )

}

export default AIPrompt
