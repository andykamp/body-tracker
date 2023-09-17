import { Button, Popover } from '@geist-ui/core'
import * as t from '@/diet-server/diet.types'
import { MoreVertical } from '@geist-ui/icons'
import { useIsMobile } from '@/common-client/utils/responsive.utils';

type ItemOptionsProps = {
  item: t.Item,
  onLock: (isLocked: boolean) => void
  onDelete?: (item: t.Item) => void
}

const ItemOptions = (props: ItemOptionsProps) => {
  const { item, onLock, onDelete } = props
  const disableLock = item.item.grams === 0

  const isMobile = useIsMobile()

  const Dropdown = () => {
    const content = <>
      <Popover.Item>
        {item.isLocked ?
          <button
            className="whitespace-nowrap"
            onClick={() => onLock(false)}
          >
            un-lock
          </button>

          :
          <button
            className={disableLock ? 'text-gray-400 cursor-not-allowed' : ''}
            disabled={disableLock}
            onClick={() => onLock(true)}
          >
            lock
          </button>
        }
      </Popover.Item>

      <Popover.Item>
        {
          onDelete &&
          <button
            onClick={() => onDelete(item)}
          >
            delete
          </button>
        }
      </Popover.Item>
    </>


    return (
      <Popover
        content={content}
        placement="bottomEnd"
        hideArrow
      >
        <Button iconRight={<MoreVertical />} auto scale={2 / 3} />
      </Popover>
    )
  }

  const Row = () => {
    return (
      <>
        {item.isLocked ?
          <button
            className="whitespace-nowrap"
            onClick={() => onLock(false)}
          >
            un-lock
          </button>

          :
          <button
            className={disableLock ? 'text-gray-400 cursor-not-allowed' : ''}
            disabled={disableLock}
            onClick={() => onLock(true)}
          >
            lock
          </button>
        }

        {
          onDelete &&
          <button
            onClick={() => onDelete(item)}
          >
            delete
          </button>
        }
      </>
    )
  }

  return (
    <div>
      {isMobile ? (
        <Dropdown />
      ) : (
        <Row />
      )}
    </div>
  );
}


export default ItemOptions;

