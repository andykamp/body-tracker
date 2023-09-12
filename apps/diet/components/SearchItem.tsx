import React from "react";
import * as t from '@/diet-server/diet.types'
import { Popover, Input, Image } from "@geist-ui/core";
import { Codepen, Codesandbox } from '@geist-ui/icons'

type SearchItemProps = {
  item: t.Product | t.Meal;
  source?: 'oda' | 'stock' | 'userproducts' | "usermeals"
};

function SearchItem({
  item,
  source
}: SearchItemProps) {

  return (
    <div
      key={item.id}
      className="flex space-x-2 items-center">

      {item.thumbnail ?
        <Image width="30px" height="30px" src={item.thumbnail} alt="thumbnail" />
        :
        <Codesandbox width="30px" height="30px" />
      }

      <Popover content={item.name}>
        <div style={{
          width: '200px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {item.name}
        </div>
      </Popover>


      <Input
        width="130px"
        value={item.protein?.toString()}
        label="protein"
      />

      <Input
        width="130px"
        value={item.calories?.toString()}
        label="calories"
      />

      <Input
        width="130px"
        value={item.grams?.toString()}
        label="grams"
      />

      {source === 'oda' &&
        <Codesandbox />
      }
      {source === 'stock' &&
        <Codepen />
      }
      {source === 'userproducts' &&
        <Codepen />
      }
      {source === 'usermeals' &&
        <Codesandbox />
      }
    </div>
  );

};
export default SearchItem;
