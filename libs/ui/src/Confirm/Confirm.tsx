import { ReactNode } from "react";
import { Modal, ModalProps } from '@geist-ui/core'

export type ConfirmProps = ModalProps & {
  shown: boolean
  title: string
  content: string | ReactNode
  onConfirmText?: string
  onConfirm: () => void,
  onCloseText?: string
  onClose: () => void,
  children: ReactNode
}
function Confirm(props: ConfirmProps) {
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
          {onCloseText}
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

export default Confirm;

