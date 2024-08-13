const fc = 'juliet@test.com';
const cxo = 'datu@test.com';
const hr = 'jane@test.com';
const logistics = 'mang@test.com';
const ap = 'juan@test.com';
const sd = 'john@test.com';

export const assignApprover = (type, currentApprover) => {
  let approver = '';
  let approvers = [];

  switch (type) {
    case 'CONSULTANCY':
      approvers = [fc, cxo, hr, ap];
      if (currentApprover === fc) approver = cxo;
      if (currentApprover === cxo) approver = hr;
      if (currentApprover === hr) approver = ap;
      if (currentApprover === ap) approver = 'approved';
      break;

    case 'CAR_RENTALS':
    case 'FREIGHT':
    case 'EVENTS':
    case 'MAINTENANCE':
    case 'MAINTENANCE_SUPPLIES':
    case 'SERVICES_OTHERS':
    case 'STATIONERY':
    case 'PANTRY_SUPPLIES':
    case 'GOODS_OTHERS':
      approvers = [fc, logistics, ap];
      if (currentApprover === fc) approver = logistics;
      if (currentApprover === logistics) approver = ap;
      if (currentApprover === ap) approver = 'approved';
      break;

    case 'GIFTS':
      approvers = [fc, hr, logistics, ap];
      if (currentApprover === fc) approver = hr;
      if (currentApprover === hr) approver = logistics;
      if (currentApprover === logistics) approver = ap;
      if (currentApprover === ap) approver = 'approved';
      break;

    case 'STAFF_SALARY':
    case 'OUTSOURCE_SALARY':
    case 'OVERTIME':
    case 'ONBOARDING':
    case 'HR_OTHERS':
      approvers = [fc, hr, cxo, ap];
      if (currentApprover === fc) approver = hr;
      if (currentApprover === hr) approver = cxo;
      if (currentApprover === cxo) approver = ap;
      if (currentApprover === ap) approver = 'approved';
      break;

    case 'COMPUTER':
    case 'PRINTER':
    case 'CARTRIDGE':
    case 'SMARTPHONE':
    case 'SD_OTHERS':
      approvers = [fc, sd, logistics, ap];
      if (currentApprover === fc) approver = sd;
      if (currentApprover === sd) approver = logistics;
      if (currentApprover === logistics) approver = ap;
      if (currentApprover === ap) approver = 'approved';
      break;

    default:
      break;
  }

  return { approver, approvers };
};