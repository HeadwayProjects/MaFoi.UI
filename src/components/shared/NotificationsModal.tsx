import React, { useRef } from "react";
import { Accordion, Button, Modal } from "react-bootstrap";
import styles from "./Notifications.module.css";
import { useState } from "react";
import { useEffect } from "react";

function NotificationsModal({ notifications, onDismiss, onSubmit }: any) {
    const containerRef = useRef<any>();
    const [readNotifications, setReadNotifications] = useState<any>({});

    function handleHeaderClick({ id, isRead }: any) {
        const _readList: any = { ...readNotifications };
        if (!_readList[id] && !isRead) {
            _readList[id] = true;
            setReadNotifications(_readList);
        }
    }

    function onClose() {
        console.log(readNotifications);
        onDismiss();
    }


    useEffect(() => {
        if (notifications) {
            const _readList: any = { ...readNotifications };
            (notifications || []).forEach((x: any) => {
                if (_readList[x.id]) {


                } else {
                    _readList[x.id] = x.isRead ? true : false;

                }
            });
            setReadNotifications(_readList);
        }
    }, [notifications]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div ref={containerRef} className={styles.notificaitonsContainer}>
                        <Accordion>
                            {
                                (notifications || []).map((notification: any) => {
                                    return (
                                        <Accordion.Item eventKey={notification.id} key={notification.id}>
                                            <Accordion.Header onClick={() => handleHeaderClick(notification)}>
                                                <div className={`${styles.notificaitonsDetails} ${readNotifications[notification.id] ? '' : styles.unread}`} >
                                                    <div className="d-flex flex-row">
                                                        <span>{notification.from}</span>
                                                        <span>{notification.sentOn}</span>
                                                    </div>
                                                    <div>{notification.subject}</div>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                culpa qui officia deserunt mollit anim id est laborum.
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    )
                                })
                            }
                        </Accordion>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end">
                    <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default NotificationsModal;