import React, { useState, useEffect } from "react";
import { hasUserAccess } from "../../backend/auth";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import Icon from "./Icon";

export type ActionButton = {
    label: string,
    name: string,
    icon?: string,
    privilege?: string,
    action?: any,
    variant?: 'primary' | 'secondary',
    disabled?: any
}


type TableActionProps = {
    buttons: ActionButton[],
    buttonsInRow?: number,
    btnLabel?: string,
    className?: string
}


export default function TableActions({ buttons, btnLabel = 'Actions', buttonsInRow = 1, className }: TableActionProps) {
    const [accessibleBtns, setButtons] = useState<ActionButton[]>([]);

    useEffect(() => {
        if (buttons) {
            setButtons(buttons.filter(({ privilege }: ActionButton) => {
                return !privilege || hasUserAccess(privilege);
            }));
        }
    }, [buttons]);

    useEffect(() => {
        if (buttons) {
          setButtons(
            buttons.filter(({ privilege }: ActionButton) => {
              return !privilege || hasUserAccess(privilege);
            })
          );
        }
      }, [buttons]);
      
    return (
        <div className="d-flex flex-row align-items-center ms-auto gap-3">
            {
                accessibleBtns.length <= buttonsInRow &&
                accessibleBtns.map((btn: ActionButton) => {
                    return (
                        <Button variant={btn.variant || 'primary'} key={btn.name}
                            className="px-3 d-flex flex-row align-items-center gap-2"
                            onClick={btn.action} disabled={btn.disabled}>
                            {
                                btn.icon && <Icon name={btn.icon} />
                            }
                            <span>{btn.label}</span>
                        </Button>
                    )
                })
            }
            {
                accessibleBtns.length > buttonsInRow &&
                <DropdownButton title={btnLabel} variant="primary">
                    {
                        accessibleBtns.map((btn: ActionButton) => {
                            return (
                                <Dropdown.Item key={btn.name}
                                    className="px-3 d-flex flex-row align-items-center gap-2"
                                    onClick={btn.action} disabled={btn.disabled}>
                                    {
                                        btn.icon && <Icon name={btn.icon} />
                                    }
                                    <span>{btn.label}</span>
                                </Dropdown.Item>
                            )
                        })
                    }
                </DropdownButton>
            }
        </div>
    )
}