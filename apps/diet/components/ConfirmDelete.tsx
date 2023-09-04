import { ReactNode } from "react";
import { Modal, ModalProps } from '@geist-ui/core'

type ConfirmDeleteProps = ModalProps & {
  shown: boolean
  title: string
  content: string | ReactNode
  onConfirmText?: string
  onConfirm: (props: any) => void,
  onCloseText?: string
  onClose: () => void,
  children: ReactNode
}
function ConfirmDelete(props: ConfirmDeleteProps) {
  const {
    shown,
    title,
    content,
    onConfirmText = 'Submit',
    onConfirm,
    onCloseText = "Cancel",
    onClose,
    children,
    ...modalProps
  } = props

  return (
    <>
      {children}
      <Modal
        visible={shown}
        onClose={onClose}
        {...modalProps}
      >
        <Modal.Title>Modal</Modal.Title>
        <Modal.Content>
          {content}
        </Modal.Content>
        <Modal.Action
          passive
          onClick={onClose}
        >
          Cancel
        </Modal.Action>
        <Modal.Action
          onClick={onConfirm}
        >
          {onConfirmText}
        </Modal.Action>
      </Modal>
    </>
  )
}

export default ConfirmDelete;

