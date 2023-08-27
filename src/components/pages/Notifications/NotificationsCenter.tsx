import React, { useEffect, useState } from "react";
import styles from "./Notifications.module.css";
import { Button } from "react-bootstrap";
import { DEFAULT_PAYLOAD } from "../../common/Table";
import { getUserDetails } from "../../../backend/auth";
import dayjs from "dayjs";
import NotificationCard from "./NotificationCard";

const Range: any = {
    LAST_10D: 'Last 10 Days',
    LAST_1W: 'Last 1 Week',
    LAST_1M: 'Last 1 Month',
    CUSTOM: 'Custom'
}

const Category: any = {
    PUSH: { value: 'push', label: 'Push Notifications', key: 'pushCounts' },
    WORK: { value: 'work', label: 'Work Notifications', key: 'workCounts' },
    BACKEND: { value: 'backend', label: 'Backend Notifications', key: 'backEndCounts' }
}

export default function NotificationsCenter() {
    const [range, setRange] = useState(Range.LAST_10D);
    const [category, setCategory] = useState<any>();
    const [payload, setPayload] = useState<any>();
    const [counts, setCounts] = useState<any>({});
    const [notifications] = useState([
        {
            "userId": "9b228c29-e61c-4ee7-9f7e-e2e9739aac92",
            "fromMail": "alert@ezycomp.com",
            "toMail": "akakhil1433@gmail.com",
            "subject": "Ezycomp - User Access Granted Location(s)",
            "mailBody": "<p style=\"color:#797979;line-height:21px;margin:10px 0;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\">Dear Akhil Kumar,</p><p style=\"color:#797979;line-height:21px;margin:10px 0;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\">We are pleased to inform you that your account has been granted access to the below Location(s) in our system. This means that you can now log in to your account and access the information and features associated with those locations.<br style=\"font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\"><br>To log in to your account, please follow the steps below:<br style=\"font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\"><br>Visit our portal at https://localhost:7221/<br style=\"font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\"><br>Click on the \"Login\" button located on the top right corner of the homepage.<br style=\"font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\"><br>Enter your username and password in the respective fields.<br style=\"font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\"><br>Go to Dashboard Menu on the left menu<br style=\"font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\"><br>Select Company, Associate Company and Location drop downs<br style=\"font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\"><br>Please note that you will only be able to access the locations that you have been granted access to. If you require access to additional locations, please contact your SPOC or our support team.<br style=\"font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\"><br>If you have any questions or concerns about your account access, please do not hesitate to contact us at {{COMPANY_SPOC_MAIL}}. We are always ready to assist you.<br style=\"font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\"><br>Thank you for choosing our service. We look forward to providing you with the best experience.<br style=\"font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\"><br><p style=\"color:#797979;line-height:21px;margin:10px 0;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\">Best regards,<br style=\"font-family:Arial,'Helvetica Neue',Helvetica,sans-serif\">EZYCOMP</p>",
            "notifyStatus": 1,
            "category": "Push",
            "id": "185a355c-2904-4ea5-9797-6ccc524e5870",
            "createdDate": "2023-08-27T06:02:12.675565Z",
            "lastUpdatedDate": "0001-01-01T00:00:00"
        }
    ]);

    function handleRangeChange(_range: string) {
        if (range !== _range) {
            setRange(_range);
        }
    }

    function getDateRange(_range: string) {
        let from: any = new Date();
        let to: any = new Date();
        if (range === Range.LAST_10D) {
            from.setDate(from.getDate() - 10);
        } else if (range === Range.LAST_1W) {
            from.setDate(from.getDate() - 7);
        } else if (range === Range.LAST_1M) {
            from.setDate(from.getMonth() - 1);
        }
        return { fromDate: dayjs(from).startOf('D').toISOString(), toDate: dayjs(to).endOf('D').toISOString() }
    }

    function handleCategoryChange(_category: string) {
        setCategory(category !== _category ? _category : null);
    }

    useEffect(() => {
        if (range) {

        }
    }, [range]);

    useEffect(() => {
        const user = getUserDetails();
        const filters = [];
        filters.push({ columnName: 'user', value: user.userid });
        const { fromDate, toDate } = getDateRange(range || Range.LAST_10D);
        filters.push({ columnName: 'fromDate', value: fromDate });
        filters.push({ columnName: 'toDate', value: toDate });
        setPayload({ ...DEFAULT_PAYLOAD, filters });
    }, []);

    return (
        <>
            <div className="d-flex flex-column" >
                <div className="d-flex  p-2 align-items-center pageHeading shadow">
                    <h4 className="mb-0 ps-1 me-auto">Notification Center</h4>
                    <div className="d-flex align-items-end h-100 ms-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 d-flex justify-content-end">
                                <li className="breadcrumb-item">Home</li>
                                <li className="breadcrumb-item">Notification Center</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="d-flex flex-column gap-3 m-3">
                    <div className="d-flex flex-row gap-3">
                        {
                            Object.keys(Range).map((key: string, index: number) => {
                                return (
                                    <Button variant={range === Range[key] ? "primary" : "default"}
                                        className={range === Range[key] ? "no-shadow" : "bg-white"}
                                        onClick={() => handleRangeChange(Range[key])} key={index}>{Range[key]}</Button>
                                )
                            })
                        }
                    </div>
                    <div className="d-flex flex-row gap-3">
                        {
                            Object.values(Category).map(({ value, label, key }: any) => {
                                return (
                                    <Button variant={category === value ? "primary" : "outline-primary"}
                                        onClick={() => handleCategoryChange(value)} key={key}>{label} ({counts[key] || 0})</Button>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={`d-flex flex-column m-0 py-2 bg-white ${styles.notificationsContainer}`}>
                    {
                        (notifications || []).map((notification: any) => {
                            return (
                                <NotificationCard key={notification.id} notification={notification} onSubmit={{}} />
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}