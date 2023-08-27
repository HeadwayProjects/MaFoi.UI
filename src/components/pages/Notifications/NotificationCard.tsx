import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import Icon from "../../common/Icon";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import dayjs from "dayjs";
import NotificationDetails from "./NotificationDetails";

export enum NotificationStatus {
    UNREAD = 1,
    READ = 2
}

export default function NotificationCard({ notification, onSubmit }: any) {
    const [open, setOpen] = useState(false);
    const [unread, setUnread] = useState(true);
    useEffect(() => {
        if (notification) {
            setUnread(notification.notifyStatus === NotificationStatus.UNREAD);
        }
    }, [notification]);
    return (
        <>
            <div className="mx-3 d-flex flex-row card shadow mb-2">
                <div className="p-4 py-2 d-flex justify-content-center">
                    <Avatar name={notification.fromMail} size="40" round={true} />
                </div>
                <div className="d-flex flex-row p-2 pe-3 pb-3 gap-3">
                    <div className="d-flex flex-column">
                        <div className="fw-bold">{notification.subject}</div>
                        <div className="ellipse two-lines" dangerouslySetInnerHTML={{ __html: notification.mailBody || '--NA--' }}></div>
                        <div className="d-flex flex-row gap-2 align-items-center mt-2">
                            <FontAwesomeIcon icon={faClock} className="text-black-600 text-sm" />
                            <span className="text-black-600 text-sm">{dayjs(new Date(notification.createdDate)).format('DD-MM-YYYY HH:mm:ss A')}</span>
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-between align-items-end" style={{ width: '200px' }}>
                        <Icon name="close" style={{ zoom: '0.7' }} />
                        <Button variant="primary" onClick={() => setOpen(true)}
                            style={{ opacity: unread ? 1 : 0.6 }}>
                            {unread ? 'Open' : 'Re-Open'}
                        </Button>
                    </div>
                </div>
            </div>
            {
                open && Boolean(notification) && <NotificationDetails notification={{ ...notification }} onClose={() => setOpen(false)} onSubmit={onSubmit} />
            }
        </>
    )
}