import { Button, Modal } from "@geist-ui/core"
import { useState } from "react";
import Prompt from "./Prompt";

function AIContainer() {
  const [shown, setShown] = useState(false);

  return (
    <>
    <Button onClick={() => setShown(true)}>Ask AI</Button>
    <Modal
      visible={shown}
      onClose={() => setShown(false)}
      width="50%"
    >
      <Modal.Title>Select an Item</Modal.Title>
      <Modal.Content>
        <Prompt/>
      </Modal.Content>
      <Modal.Action passive onClick={() => setShown(false)}>
        Cancel
      </Modal.Action>
    </Modal>
    </>
  )

}

export default AIContainer
