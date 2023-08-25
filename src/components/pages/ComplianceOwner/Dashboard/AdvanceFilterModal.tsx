import React from "react";
import { Button, Modal } from "react-bootstrap";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";

export default function AdvanceFilterModal({ onCancel, onSubmit }: any) {

    function clearFilter() {
        onSubmit({});
        onCancel();
    }

    function search() {

    }

    return (
        <>
            <Modal show={true} backdrop="static" animation={false} dialogClassName="drawer" size="lg">
                <Modal.Header closeButton={true} onHide={onCancel}>
                    <Modal.Title className="bg">Advance Filters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-start">
                        <div className="col-12">
                            <form>
                                <div className="row mt-3">
                                    <div className="col-12">
                                        {/* <FormRenderer FormTemplate={FormTemplate}
                                            initialValues={filter}
                                            componentMapper={ComponentMapper}
                                            schema={schema}
                                            debug={debugForm}
                                        /> */}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={onCancel} className="btn btn-outline-secondary">
                        Back
                    </Button>
                    <div>
                        <Button variant="primary" onClick={clearFilter} className="mx-3">Clear</Button>
                        <Button variant="primary" onClick={search} >Submit</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}