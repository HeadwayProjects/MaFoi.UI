import { ACTIVITY_STATUS, AUDIT_STATUS, STATUS_MAPPING } from "../components/common/Constants";
import dayjs from "dayjs";

export function preventDefault(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

export function getValue(obj, key) {
  if (!obj || !key) {
    return null
  }
  let value = { ...obj };
  const keys = (key || '').split('.');
  keys.forEach(_key => {
    value = (value || {})[_key];
  });
  return value;
}

export function MaskEmail(email) {
  return (email || '').replace(/^(.)(.*)(.@.*)$/,
    (_, a, b, c) => a + b.replace(/./g, '*') + c
  );
}

export function download(fileName, filePath) {
  if (fileName && filePath) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export function humanReadableFileSize(size) {
  var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

export function auditReport(summary, data, user) {
  const { company, associateCompany, location, month, year } = summary;
  const approved = data.filter(x => x.status === ACTIVITY_STATUS.AUDITED).length;
  const rejected = data.filter(x => x.status === ACTIVITY_STATUS.REJECTED).length;
  const compliance = data.filter(x => x.auditStatus === AUDIT_STATUS.COMPLIANT || x.auditStatus === AUDIT_STATUS.NOT_APPLICABLE).length;
  const nonCompliance = data.filter(x => x.auditStatus === AUDIT_STATUS.NON_COMPLIANCE).length;
  const total = compliance + nonCompliance;
  const compliancePer = total > 0 ? Math.round(compliance * 100 / total) : 0;
  const nonCompliancePer = total > 0 ? Math.round(nonCompliance * 100 / total) : 0;

  const html = `
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Audit Report</title>
      <style>
        body  {
            font-family: SANS-SERIF;
        }
        .row {
          display: flex;
        }
    
        .col {
          flex: 1
        }
    
        .table1 {
          border-collapse: collapse;
          width: 100%;
        }
    
        .table2 {
          border-collapse: collapse;
          width: 100%;
        }
    
        table.no-border,
        table.no-border td,
        table.no-border th {
          border: none;
        }
    
        table,
        td,
        th {
          border: 1px solid black;
          vertical-align: top;
          font-size: 12px;
        }
      </style>
    </head>
    
    <body>
      <h1 style="text-decoration:underline; text-align:center">Audit Report for the Month of ${month}, ${year} </h1>
      <div class="row">
        <div class="col">
          <table class="no-border" cellspacing="0" cellpadding="8">
            <thead>
              <tr>
                <th colspan="2"><b style="text-decoration:underline;">Audit Submitted To</b></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Company Name</td>
                <td>: ${company}</td>
              </tr>
              <tr>
                <td>Associate Company Name</td>
                <td>: ${associateCompany}</td>
              </tr>
              <tr>
                <td>Location</td>
                <td>: ${location}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- </div> -->
        <div class="col">
          <table class="no-border" cellspacing="0" cellpadding="8">
            <thead>
              <tr>
                <th colspan="2"><b style="text-decoration:underline;">Audit Submitted By</b></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Auditor Name</td>
                <td>: Mr./Mrs ${user}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>Plot No. 3726, New no. 41</td>
              </tr>
              <tr>
                <td></td>
                <td>6th Avenue, Q Block</td>
              </tr>
              <tr>
                <td></td>
                <td>Anna Nagar, Chennai 600040</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
      <h1 style="text-decoration:underline;">Summary:</h1>
      <table class="table1">
        <tr>
          <th>Data Submitted</th>
          <th>Audit Status</th>
        </tr>
        <tr>
    
          <td>
            <h4>Submit Status</h4>
            <input type="text" placeholder="Approved (${approved})" /><br>
            <input type="text" placeholder="Rejected (${rejected})" /><br>
          </td>
    
          <td>
            <h4>Audit Status</h4>
            <p>*Compliant ${compliancePer}%&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Non-Compliance ${nonCompliancePer}%</p>
            <p style="color: red;"><small>* This includes Not Applicable activities</small></p>
          </td>
        </tr>
      </table>
    </body>
    
    </html>`;
  const win = window.open(null, '_blank', 'width=900,height=700');
  const uri = 'data:text/html;filename=AuditReport.html;charset=utf-8,' + encodeURI(html);
  win.document.write('<iframe src="' + uri + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}

export function checkList(summary, data) {
  const { company, associateCompany, location, month, year } = summary;
  const activities = data.filter(x => x.status === ACTIVITY_STATUS.AUDITED || x.status === ACTIVITY_STATUS.REJECTED);
  const audited = data.filter(x => x.status === ACTIVITY_STATUS.AUDITED);
  const rejected = data.filter(x => x.status === ACTIVITY_STATUS.REJECTED);
  const compliant = activities.filter(x => x.auditStatus === AUDIT_STATUS.COMPLIANT);
  const nonCompliance = activities.filter(x => x.auditStatus === AUDIT_STATUS.NON_COMPLIANCE);
  const notApplicable = activities.filter(x => x.auditStatus === AUDIT_STATUS.NOT_APPLICABLE);
  const total = compliant.length + nonCompliance.length + rejected.length;
  const compliancePer = total > 0 ? (compliant.length * 100 / total).toFixed(1) : 0;
  const nonCompliancePer = total > 0 ? (nonCompliance.length * 100 / total).toFixed(1) : 0;
  const rejectedPer = total > 0 ? (rejected.length * 100 / total).toFixed(1) : 0;

  const _summary = `
        <div class="flex" style="margin-bottom: 20px">
            <div>
                <table class="no-border" cellspacing="0" cellpadding="8">
                    <thead>
                    <tr>
                        <th colspan="2"><b style="text-decoration:underline;">Audit Submitted To</b></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><strong>Company Name</strong></td>
                        <td>: ${company}</td>
                    </tr>
                    <tr>
                        <td><strong>Associate Company Name</strong></td>
                        <td>: ${associateCompany}</td>
                    </tr>
                    <tr>
                        <td><strong>Location</strong></td>
                        <td>: ${location}</td>
                    </tr>
                    <tr>
                        <td><strong>Month & Year</strong></td>
                        <td>: ${month} (${year})</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin-right: 30px">
                <table class="no-border" cellspacing="0" cellpadding="8">
                    <thead>
                    <tr>
                        <th colspan="2"><b style="text-decoration:underline;">Audit Summary</b></th>
                    </tr>
                    </thead>
                    <tbody style="color:white">
                    <tr style="background: green;">
                        <td><strong>Audited</strong></td>
                        <td>: ${audited.length}</td>
                    </tr>
                    <tr style="background: gray;">
                        <td><strong>Non-Compliance</strong></td>
                        <td>: ${notApplicable.length}</td>
                    </tr>
                    <tr style="background: red;">
                        <td><strong>Rejected</strong></td>
                        <td>: ${rejectedPer}% (${rejected.length || 0})</td>
                    </tr>
                    <tr style="background: forestgreen;">
                        <td><strong>Compliant</strong></td>
                        <td>: ${compliancePer}% (${compliant.length || 0})</td>
                    </tr>
                    <tr style="background: red;">
                        <td><strong>Non-Compliance</strong></td>
                        <td>: ${nonCompliancePer}% (${nonCompliance.length || 0})</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

  const _activities = activities.map((activity, index) => {
    return `
            <tr>
                <td>${index + 1}</td>
                <td>${activity.act.name}</td>
                <td>${activity.rule.name}</td>
                <td>${activity.activity.name}</td>
                <td>${dayjs(new Date(activity.dueDate)).format('DD-MM-YYYY')}</td>
                <td>${dayjs(new Date(activity.submittedDate)).format('DD-MM-YYYY')}</td>
                <td>${STATUS_MAPPING[activity.status]}</td>
                <td>${activity.auditStatus === AUDIT_STATUS.COMPLIANT ? 'Y' : ''}</td>
                <td>${activity.auditStatus === AUDIT_STATUS.NON_COMPLIANCE ? 'Y' : ''}</td>
                <td>${activity.auditStatus === AUDIT_STATUS.NOT_APPLICABLE ? 'Y' : ''}</td>
                <td>${activity.formsStatusRemarks || ''}</td>
            </tr>
        `
  }).join('');
  const _audited = `
        <tr>
            <td colspan="6" style="background-color: green;">Audited</td>
            <td>${audited.length || 0}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    `;
  const _rejected = `
        <tr>
            <td colspan="6" style="background-color: red;">Rejected</td>
            <td>${rejected.length || 0}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    `;
  const _compliant = `
        <tr>
            <td colspan="6" style="background-color: lightgreen;">Compliant</td>
            <td></td>
            <td>${compliant.length || 0}</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    `;
  const _nonCompliance = `
        <tr>
            <td colspan="6" style="background-color: red;">Non-Compliance</td>
            <td></td>
            <td></td>
            <td>${nonCompliance.length || 0}</td>
            <td></td>
            <td></td>
        </tr>
    `;
  const _notApplicable = `
        <tr>
            <td colspan="6" style="background-color: orange;">Not Applicable</td>
            <td></td>
            <td></td>
            <td></td>
            <td>${notApplicable.length || 0}</td>
            <td></td>
        </tr>
    `;

  const _content = `
        <table cellspacing="0" cellpadding="8">
            <thead>
                <tr>
                    <th style="background-color: rgb(85, 205, 226);">S.No</th>
                    <th style="background-color: rgb(85, 205, 226);">Act</th>
                    <th style="background-color: rgb(85, 205, 226);">Rule</th>
                    <th style="background-color: rgb(85, 205, 226);">Forms / Registers & Returns</th>
                    <th style="background-color: rgb(85, 205, 226);">Audit Due Date</th>
                    <th style="background-color: rgb(85, 205, 226);">Vendor Submitted Date</th>
                    <th style="background-color: rgb(85, 205, 226);">Status</th>
                    <th style="background-color: forestgreen;">Compliant</th>
                    <th style="background-color: red;">Non-Compliance</th>
                    <th style="background-color: gray;">Not Applicable</th>
                    <th style="background-color: rgb(85, 205, 226);">Remarks, if any</th>
                </tr>
            </thead>
            <tbody>
                ${_activities}
                ${_audited}
                ${_rejected}
                ${_compliant}
                ${_nonCompliance}
                ${_notApplicable}
            </tbody>
        </table>
    `;

  const html = `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FA Check-List</title>
        <style>
            body  {
                font-family: SANS-SERIF;
            }

            .table1,
            .table2,
            .table3 {
                border-collapse: collapse;
                width: 100%;
            }
    
            table.no-border,
            table.no-border td,
            table.no-border th {
                border: none;
            }
    
            table,
            td,
            th {
                border: 1px solid gray;
                font-size: 12px;
            }

            .flex {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
        </style>
    </head>
    
    <body>
        <h3 style="text-align: center;">Audit Report for ${month}, ${year}</h3>
        ${_summary}
        ${_content}
        <div class="flex" style="padding: 30px; margin-right: 40px; margin-top: 40px;">
            <div></div>
            <div style="text-align: center">
                <p>Audit Submitted By.</p>
                <p>Vasu</p>
            </div>
        </div>
    </body>
    </html>`;

  const win = window.open(null, '_blank', 'width=1280,height=700');
  const uri = 'data:text/html;filename=FACheckList.html;charset=utf-8,' + encodeURI(html);
  win.document.write('<iframe src="' + uri + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
}