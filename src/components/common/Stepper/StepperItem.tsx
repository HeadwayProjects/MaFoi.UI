import React, { useEffect, useState } from "react";
import styles from "./Stepper.module.css"
import Icon from "../Icon";

export default function StepperItem({ title, children, valid, activeStep, stepId }: any) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (activeStep) {
            setOpen(activeStep === stepId || activeStep === -1);
        }
    }, [activeStep])

    return (
        <div className={styles.stepItemContainer}>
            <div className={`${styles.stepItemHeader} ${open ? 'active' : ''} ${valid ? 'valid' : ''}`}>
                <div className={`${styles.stepItemTitle}`}>{title}</div>
                {
                    valid &&
                    <Icon name="check-circle" className="text-xl text-success" />
                }
            </div>
            <div className={`${styles.stepItemBody} ${!open ? styles.stemItemClose : ''}`}>{children}</div>
        </div>
    )
}