import { ReactNode, useCallback, useState } from 'react';
import moment from 'moment';
import './calendar.css';
import events from './event';
export function Calendar() {
    const [eventsPerMonths, setEventsPerMonths] = useState({
        'January': [] as any,
        'February': [] as any,
        'March': [] as any,
        'April': [] as any,
        'May': [] as any,
        'June': [] as any,
        'July': [] as any,
        'August': [] as any,
        'September': [] as any,
        'October': [] as any,
        'November': [] as any,
        'December': [] as any
    });
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRD', 'SAT', 'SUN'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const year = moment().year();
    const weekdays: ReactNode[] = [];
    for (let i = 0; i < 6; i++) {
        days.map(p => weekdays.push(<div key={i} className='day-div'>{p}</div>))
    }
    const populateDates = () => {
        const tableContent: ReactNode[] = [];
        months.forEach(month => {
            const dates: ReactNode[] = [];
            const monthIndex = months.indexOf(month) + 1;
            let totalDays = moment(`${year}-${monthIndex}`, 'YYYY-MM').daysInMonth();
            let monthStartDate = moment(`${year}-${monthIndex}-01`, 'YYYY-MM-DD').day();
            for (let i = 1; i <= totalDays; i++) {
                dates.push(
                    <span key={i} className='date-val'>{i}</span>
                );
            }
            const dateContent = <div className='date' style={{ paddingLeft: `${(10 + ((monthStartDate === 0 ? 7 : monthStartDate) - 1) * 2.14285)}%` }}>
                {dates}
            </div>
            // const content = <table className="content-table">
            //     <tr>
            //         <td>
            //             <div className="month">{month}</div>
            //         </td>
            //         <td>
            //             <div className="week-box left">
            //                 {populateEvents(month)}
            //             </div>
            //         </td>
            //     </tr>
            // </table>
            const content = <div className='content-events'>
            <div className='event-month'>{month}</div>
            <div className='event-list'>
            {populateEvents(month)}
            </div>
        </div>
            tableContent.push(dateContent);
            tableContent.push(content);
        })

        return tableContent.map(p => p);
    }
    const populateEvents = (month: string) => {
        let events: any[] = [];
        switch (month) {
            case 'January': events = eventsPerMonths.January; break;
            case 'February': events = eventsPerMonths.February; break;
            case 'March': events = eventsPerMonths.March; break;
            case 'April': events = eventsPerMonths.April; break;
            case 'May': events = eventsPerMonths.May; break;
            case 'June': events = eventsPerMonths.June; break;
            case 'July': events = eventsPerMonths.July; break;
            case 'August': events = eventsPerMonths.August; break;
            case 'September': events = eventsPerMonths.September; break;
            case 'October': events = eventsPerMonths.October; break;
            case 'November': events = eventsPerMonths.November; break;
            case 'December': events = eventsPerMonths.December; break;

        }

        return events.map(event => {
            const date = moment(event.start_date).date();
            const monthIndex = months.indexOf(month) + 1;
            const width = moment(event.end_date).diff(moment(event.start_date), 'days');
            let monthStartDate = moment(`${year}-${monthIndex}-01`, 'YYYY-MM-DD').day();
            const left = ((monthStartDate - 1) + (date - 1)) * 2.38095;
            return <div className="event" style={{ left: `${left}%`, width: `${(width + 1) * 2.38095}%`, backgroundColor: event.color }}>{event.title}</div>
        });
    }
    const populateWeeks = () => {
        const heads: ReactNode[] = [];
        for (let i = 1; i <= 6; i++) {
            heads.push(<th>{`Week ${i}`}</th>);
        }
        const weekTable: ReactNode = <table className="table-header">
            <thead>
                <tr>
                    {
                        heads
                    }
                </tr>
            </thead>
        </table>
        return weekTable;
    }
    const seggregateEventsIntoMonths = () => {
        events.forEach(event => {
            const startDate = moment(event.start_date);
            const endOfMonth = startDate.endOf('month');
            const endDate = moment(event.end_date);
            const diff = endDate.diff(endOfMonth, 'days');
            const month = startDate.month();
            const startYear = startDate.year();
            const endYear = endDate.year();
            if (startYear === year && endYear === year) {
                if (diff > 0) {
                    const endMonth = endDate.month();
                    pushEvents({
                        ...event,
                        start_date: event.start_date,
                        end_date: endOfMonth.format('YYYY-MM-DD'),
                        month_index: month + 1
                    }, month);
                    pushEvents({
                        ...event,
                        start_date: endOfMonth.add(1, 'day').format('YYYY-MM-DD'),
                        month_index: endMonth + 1
                    }, endMonth);
                } else {
                    pushEvents({
                        ...event,
                        month_index: month + 1
                    }, 1);
                }
            }
        });
    }
    const pushEvents = useCallback((event: any, month: any) => {
        switch (month) {
            case 0: eventsPerMonths.January.push(event); break;
            case 1: eventsPerMonths.February.push(event); break;
            case 3: eventsPerMonths.March.push(event); break;
            case 4: eventsPerMonths.April.push(event); break;
            case 5: eventsPerMonths.May.push(event); break;
            case 6: eventsPerMonths.June.push(event); break;
            case 7: eventsPerMonths.August.push(event); break;
            case 8: eventsPerMonths.September.push(event); break;
            case 9: eventsPerMonths.October.push(event); break;
            case 10: eventsPerMonths.November.push(event); break;
            case 11: eventsPerMonths.December.push(event); break;
        }
        console.log(eventsPerMonths);
    }, [eventsPerMonths]);
    seggregateEventsIntoMonths();
    return (
        <div id="calendar">
            <div id="content">
                <div className="header">
                    {populateWeeks()}
                    <div className='day-header'>
                        {
                            weekdays
                        }
                    </div>
                </div>
                <div className="container">
                    {populateDates()}
                </div>
            </div>

        </div>
    )
}