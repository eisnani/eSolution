import './Work.scss';

export default function Work({ document }) {

  const usDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="work">
      <h3 className='h3-heading mb-5px'>{document.title.charAt(0).toUpperCase() + document.title.slice(1)}</h3>
      <p className='mb-2r'>
        Due date: 
        <span className={document.dueDate.toDate() < (new Date()) ? 'overdue' : ''}
          > {document.dueDate.toDate().toDateString()}
        </span>
      </p>
      <p className='requester'>{`${document.requestedBy.firstName} ${document.requestedBy.lastName}`}</p>
      <p className='department mb-2r'>{document.requestedBy.department}</p>
      <p className='type'>{document.type.toLowerCase().replace(/_/g, " ")}</p>
      <p className='description'>{document.description.charAt(0).toUpperCase() + document.description.slice(1)}</p>
      <p className='amount'>Amount: {usDollar.format(document.amount)}</p>
    </div>
  )
}