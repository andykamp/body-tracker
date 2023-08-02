export type ProductAddNewProps = {
  onAdd: () => void,
  isFetching: boolean,
}

function ProductAddNew(props: ProductAddNewProps) {
  const {
    onAdd,
    isFetching,
  } = props

  return (
    <div className="w-full">
      {isFetching ?
        <div>Loading...</div>
        :
        (<button
          onClick={() => {
            onAdd()
          }}
        >
          Add product
        </button>
        )}
    </div>
  )
}

export default ProductAddNew;

