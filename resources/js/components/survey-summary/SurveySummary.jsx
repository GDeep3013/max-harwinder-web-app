import React, { useState, useRef, useEffect } from "react";
import { Container, Dropdown, Row, Col, Button } from 'react-bootstrap';
import { formatDateGB } from '../../utils/dateUtils'
import ChartBar from "./ChartBar"
import CompetencyBar from "./CompetencyBar"
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../../layout/Auth";
import Loading from "../Loading";
import html2pdf from 'html2pdf.js';
import { color } from "chart.js/helpers";
import SummaryPdf from './SummaryPdf'
import ReactDOMServer from 'react-dom/server';
const SurveySummary = () => {
    const { id } = useParams();

    const [completedResponses, setCompletedResponses] = useState({});
    const [totals, setTotals] = useState({});
    const [loader, setLoader] = useState(true);
    const [survey, setSurvey] = useState();
    const [reportData, setReportData] = useState();
    const [participants, setParticipants] = useState();
    const [competencyReport, setCompetencyReport] = useState();
    const [summaryArray, setSummaryArray] = useState([]);
    const [samrtGoals, setSamrtGoals] = useState();
    const [pdf, setPdf] = useState(false);

    const reportRef = useRef(null);

    const removeSpacesFromKeys = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(removeSpacesFromKeys);
        } else if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce((acc, key) => {
                const newKey = key.replace(/\s+/g, ''); // Remove all spaces from the key
                acc[newKey] = removeSpacesFromKeys(obj[key]);
                return acc;
            }, {});
        }
        return obj;
    };

    const getSurvey = async (survey_id) => {
        try {
            const url = `/api/surveys?survey_id=${survey_id}`;
            const response = await fetch(url, {
                headers: { 'x-api-key': import.meta.env.VITE_X_API_KEY }
            });
            if (response.ok) {
                const data = await response.json();
                setSurvey(data?.data?.[0]);
            } else {
                console.error('Failed to fetch survey');
            }
        } catch (error) {
            console.error('Error fetching survey:', error);

        }
    };
    const getTotalParticipantsInvited = async (survey_id) => {
        try {

            const url = `/api/surveys/participants/invited/${survey_id}`;
            const response = await fetch(url, {
                headers: { 'x-api-key': import.meta.env.VITE_X_API_KEY }
            });
            if (response.ok) {
                const data = await response.json();
                setCompletedResponses(data.completedResponses || {});
                setTotals(data.totals || {});
                setParticipants(data.participants || {})
            } else {
                console.error('Failed to fetch survey');
            }
        } catch (error) {
            console.error('Error fetching survey:', error);
        }
    }
    const generateSurveyReport = async (survey_id, action) => {
        try {

            const url = `/api/surveys/generate-report/${survey_id}?action=${action}`;
            const response = await fetch(url, {
                headers: { 'x-api-key': import.meta.env.VITE_X_API_KEY }
            });
            if (response.ok) {
                const data = await response.json();
                setReportData(data.reports?.categories || {});
                let summaryValue = removeSpacesFromKeys(data.summary.response_Data)
                let newData = (data.summary.response_Data) ? data.summary.response_Data : data.summary
                setSummaryArray(newData);
            } else {
                console.error('Failed to fetch survey');
            }
        } catch (error) {
            console.error('Error fetching survey:', error);
        } finally {
            setLoader(false);
        }
    };
    const generateCompetencyAverageReport = async (survey_id) => {
        try {

            const url = `/api/surveys/generate-competency-average/${survey_id}`;
            const response = await fetch(url, {
                headers: { 'x-api-key': import.meta.env.VITE_X_API_KEY }
            });
            if (response.ok) {
                const data = await response.json();
                setCompetencyReport(data || {});
            } else {
                console.error('Failed to fetch survey');
            }
        } catch (error) {
            console.error('Error fetching survey:', error);
        } finally {
            // setLoader(false);
        }
    };

    const getSmartGoals = async (survey_id, competencyReport) => {
        try {
            // setLoader(true);
            const developmentalOpportunity = competencyReport?.developmentalOpportunity || 'nothing';
            const url = `/api/surveys/smart-goals/${survey_id}/${developmentalOpportunity}/${competencyReport?.topStrength}`;
            // console.log('test1', url)
            const response = await fetch(url, {
                headers: { 'x-api-key': import.meta.env.VITE_X_API_KEY }
            });


            if (response.ok) {
                console.log('tetauygsdyuh')
                const data = await response.json();
                if (data?.samrtgoals) {
                    setSamrtGoals(data?.samrtgoals)
                    // console.log(data)
                }
            } else {
                console.error('Failed to fetch getSmartGoals');
            }
        } catch (error) {
            console.error('Error fetching getSmartGoals:', error);
        } finally {
            // setLoader(false);
        }

    }

    useEffect(() => {
        getSmartGoals(id, competencyReport)
    }, [competencyReport])

    useEffect(() => {
        if (id) {
            getTotalParticipantsInvited(id);
            getSurvey(id)
            generateCompetencyAverageReport(id)
            generateSurveyReport(id, "Generate")
        }
    }, [id]);

    const Participants = ['Self', 'Direct Report', 'Teammate', 'Supervisor', 'Other'];

    const renderTableRows = (data) => {
        return Participants.map((Participant, index) => (
            <tr key={Participant} style={{ backgroundColor: index % 2 === 0 ? '#F2F8FB' : '#ffffff' }}>
                <td className="px-3 md:px-5 py-3 font-poppins">{Participant}</td>
                <td className="px-3 md:px-5 py-3 font-poppins text-center">{data?.totals?.[Participant] || 0}</td>
                <td className="px-3 md:px-5 py-3 font-poppins text-center">{data?.completedResponses?.[Participant] || 0}</td>
            </tr>
        ));
    };
    const totalInvited = Participants.reduce((acc, Participant) => acc + (totals[Participant] || 0), 0);
    const totalCompleted = Participants.reduce((acc, Participant) => acc + (completedResponses[Participant] || 0), 0);
    const renderCharts = () => {
        if (!reportData) return null;

        return Object.entries(reportData).map(([competency, data]) => (
            <ChartBar key={competency} competency={competency} data={data} reportData={reportData} />
        ));
    };


    const renderCharts2 = () => {
        if (!reportData) {
            return null;
        } else {
            return <CompetencyBar data={reportData} />
        }
        // 
    };

    const ReGenerateReport = () => {
        setLoader(true)
        generateSurveyReport(id, "ReGenerate")

    }


   
    const generatePdf = () => {
            // 1. Convert React component to static HTML string
            // const componentHtml = ReactDOMServer.renderToStaticMarkup(
            //     <SummaryPdf
            //     reportRef={reportRef}
            //         completedResponses={completedResponses}
            //         totals={totals}
            //         reportData={reportData}
            //         participants={participants}
            //         competencyReport={competencyReport}
            //         survey={survey}
            //         loader={loader}
            //         renderTableRows={renderTableRows}
            //         totalInvited={totalInvited}
            //         totalCompleted={totalCompleted}
            //         summaryArray={summaryArray}
            //     />
            // );
        
            // // Create a new div element to hold the HTML string
            // const element = document.createElement('div');
            // element.innerHTML = componentHtml;
        
            // // Use html2canvas to ensure all charts and elements are rendered as images
            // html2pdf()
            //     .from(element)
            //     .set({
            //         margin: 15,
            //         filename: 'survey_report.pdf',
            //         image: { type: 'jpeg', quality: 0.98 },
            //         html2canvas: { scale: 2, useCORS: true }, // Higher scale for better image quality
            //         jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            //         pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            //     })
            //     .toPdf()
            //     .get('pdf')
            //     .then((pdf) => {
            //         const totalPages = pdf.internal.getNumberOfPages();
            //         for (let i = 1; i <= totalPages; i++) {
            //             pdf.setPage(i);
            //             pdf.setFontSize(10);
            //             pdf.text(`Page ${i} of ${totalPages}`, pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() - 10, {
            //                 align: 'center',
            //             });
            //         }
            //     })
            //     .save();
        
    
        setPdf(true)
        const element = reportRef.current; // Reference to the component you want to convert to PDF
        const options = {
            margin: 15,  // General margin for the document
            filename: 'survey_report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 1, useCORS: true }, // High scale for better quality
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }, // Options for page breaks
        };

        // Generate PDF
        html2pdf()
            .from(element)
            .set(options)
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                // Handle cases where content overflows and needs pagination
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    pdf.setFontSize(10);
                }
            })
            .save();
    };
    // console.log('summaryArray', summaryArray)
    



    return (
        <AuthLayout title={"Survey Summary"}>
            <div className="survey-inner relative">
                {!loader ? (
                    <Container>
                        <Button className="survey-inner-btn absolute" onClick={() => { ReGenerateReport() }}>Re-Generate</Button>
                        <div className="survey-container" ref={reportRef}>
                            <h2 className="font-frank mb-4" style={{ color: '#174A6D', fontSize: '48px' }}>
                                LOOP3D 360 Report
                            </h2>
                            <div className="participant-name-looped-360 mt-4">
                                <p className="mb-4 font-poppins" style={{ fontSize: '25px', color: '#174A6D' }}>
                                    <strong className="fw-normal font-frank" style={{ color: '#000' }}>Participant Name:</strong> {survey?.loop_lead?.first_name}
                                </p>
                                <p className="mb-4 font-poppins" style={{ fontSize: '25px', color: '#174A6D' }}>
                                    <strong className="fw-normal font-frank" style={{ color: '#000' }}>Report Generation Date:</strong> {formatDateGB(survey?.createdAt)}
                                </p>
                                <p className="mt-4 mb-4">
                                    Welcome to your personalized 360° feedback report customized to gather insight into your leadership strengths and opportunities. The data is gathered from coworkers you selected and the measures are based on competencies specific to your role. The purpose is to evaluate self-perception on these competencies and the perception of your respondents. Keep in mind that this report measures frequency of application of these behaviors or competencies.
                                </p>
                                <p className="mb-4">
                                    <strong className="fw-normal font-frank" style={{ fontSize: '48px', lineHeight: '50px', color: '#000' }}>About Your Report</strong>
                                </p>
                                <h3 className="fw-normal font-frank" style={{ fontSize: '35px', lineHeight: '30px', color: '#000' }}>
                                    Total number of responses:
                                </h3>
                                {loader ? (
                                    <p>Loading...</p>
                                ) : (
                                    <div className="overflow-x-auto mt-4" style={{ boxShadow: '0 0 10px #ddd', borderRadius: '0 0 10px 10px' }}>
                                        <table className="w-100">
                                            <thead>
                                                <tr>
                                                    <th className="bg-custom-color px-3 md:px-5 py-4 text-left font-poppins text-white" style={{ borderRadius: '10px 0 0 0' }}>Relationship</th>
                                                    <th className="bg-custom-color px-3 md:px-5 py-4 text-center font-poppins text-white font-normal border-none">Participants Invited</th>
                                                    <th className="bg-custom-color px-3 md:px-5 py-4 text-center font-poppins text-white font-normal border-none" style={{ borderRadius: '0 10px 0 0' }}>Completed Responses</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderTableRows({ completedResponses, totals })}
                                                <tr>
                                                    <td className="px-3 md:px-5 py-4 font-poppins">Total</td>
                                                    <td className="px-3 md:px-5 py-4 font-poppins text-center">{totalInvited}</td>
                                                    <td className="px-3 md:px-5 py-4 font-poppins text-center">{totalCompleted}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                <p className="font-poppins text-black" style={{ fontSize: '18px', lineHeight: '30px', marginTop: '25px' }}>*Please note that we need a minimum of two respondents (other than self or manager) to maintain anonymity. If less than 2 is reported in any category, they will be combined with another category. </p>
    
                        <div className="participants_bg" style={{ backgroundColor: '#174A6D', padding: "50px 30px", marginTop: '25px' }}>
                                    <div className="row">
                                        <div className="col-md-12 col-lg-6">
                                            <h3 className="text-white font-frank fw-normal" style={{ fontSize: '25px' }}>
                                                Here are the participants that you invited:
                                               </h3>
                                            <ul className="pl-4 sm:pl-6">
                                                {participants?.map((participant) => (
                                                    <li className="list-disc text-white font-poppins" style={{ fontSize: '18px', lineHeight: '38px' }} key={participant._id}>
                                                        {`${participant?.p_first_name} ${participant?.p_last_name } (${ participant?.p_type})`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="col-md-12 col-lg-6">
                                        <p className="text-white font-frank mb-4" style={{ fontSize: '25px' }}>
                                            Here are the competencies that your manager selected as the most important to your role...
                                        </p>
                                        <ul className="pl-4 sm:pl-6">
                                            {survey?.competencies?.map((competency) => (
                                                <li className="list-disc text-white font-poppins" style={{ fontSize: '18px', lineHeight: '38px' }} key={competency._id}>
                                                    {competency?.category_name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
    
                            <div className="summary_graph_top" style={{ backgroundColor: '#F5F5F5', padding: '60px 30px' }}>
                                <p className="font-frank mt-4 mb-4" style={{ fontSize: '48px', lineHeight: '50px' }}>
                                    Summary of your results:
                                </p>
                                {/* graph box */}
                                <div className="graph-box mt-5 mb-5" style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '20px 30px' }}>
                                    {renderCharts2()}
                                </div>
    
                                <h3 className="text-custom-color fw-semibold">Top Strengths:</h3>
                                <p className="text-sm sm:text-base leading-relaxed text-gray-600 font-poppins mt-4 mb-4">
                                    {competencyReport?.topStrength}
                                </p>
    
                                <h3 className="text-custom-color fw-semibold">Top Developmental Opportunities:</h3>
                                <p className="text-sm sm:text-base leading-relaxed text-gray-600 font-poppins mt-4 mb-4">
                                    {competencyReport?.developmentalOpportunity}
                                </p>
                            </div>
    
                            <div className="participants_bg" style={{ backgroundColor: '#174A6D', padding: "50px 30px" }}>
                                <h2 className="text-white font-frank fw-normal">
                                    Summaries by Competency
                                </h2>
                                <div>{renderCharts()}</div>
                            </div>
                            <h3 className="text-custom-color font-frank fw-medium mt-4" style={{ fontSize: '48px', lineHeight: '50px' }}>
                                Open-Ended Comments 
                            </h3>
                            <p className="text-sm sm:text-base leading-relaxed text-gray-600 font-poppins mt-4 mb-4">
                                Here are the competencies that your manager selected as the most important to your role...
                            </p>
                            <div className="chat-gpt-summary">
                                {summaryArray && (
                                    <>
                                        {/* Strengths and Skills */}
                                        <div className="summary-item">
                                            <h2 className="font-frank text-black" style={{ fontSize:'25px', lineHeight:'30px' }}> Q1. What are the strengths and skills that make this person most effective?</h2>
                                            <p className="font-poppins fw-normal" style={{ fontSize:'20px' }}><strong className="font-frank fw-medium" style={{ fontSize:'25px' }}>Total Summary:</strong> Example summary.</p>
                                            {summaryArray?.question_summary?.strengthsAndSkills?.map((item, index) => (
                                                <p key={index}><strong className="font-frank fw-normal" style={{ fontSize:'25px' }}>{item.role}:</strong> {item.summary}</p>
                                            ))}
                                        </div>

                                        {/* Suggestions for Improvement */}
                                        <div className="summary-item" style={{ backgroundColor:'#F2F8FB', padding:'50px 20px' }}>
                                            <h2 className="font-frank text-black" style={{ fontSize:'25px', lineHeight:'30px' }}>Q2. What suggestions do you have to make this person a stronger performer and more effective?</h2>
                                            <p className="font-poppins" style={{ fontSize:'20px' }}><strong className="font-frank fw-normal" style={{ fontSize:'25px' }}>Total Summary:</strong> Example summary.</p>
                                            {summaryArray?.question_summary?.suggestionsForImprovement?.map((item, index) => (
                                                <p key={index}><strong className="font-frank fw-normal" style={{ fontSize:'25px' }}>{item.role}:</strong> {item.summary}</p>
                                            ))}
                                        </div>

                                        {/* Other Comments */}
                                        <div className="summary-item">
                                            <h2 className="font-frank text-black" style={{ fontSize:'25px', lineHeight:'30px' }}>Q3. Other comments?</h2>
                                            <p className="font-poppins" style={{ fontSize:'20px' }}><strong className="font-frank fw-normal" style={{ fontSize:'25px' }}>Total Summary:</strong> Example summary.</p>
                                            {summaryArray?.question_summary?.otherComments?.map((item, index) => (
                                                <p key={index}><strong className="font-frank fw-normal" style={{ fontSize:'25px' }}>{item.role}:</strong> {item.summary}</p>
                                            ))}
                                        </div>

                                       
                                    </>
                                )}
                            </div>
                            {summaryArray && (
                                <div className="summary-item chat-smart-goal" style={{ backgroundColor: '#F2F8FB', padding: '50px 20px' }}>
                                    <div className="summary-section summary-inner-text">
                                    <h3 className="font-frank text-custom-color" style={{ fontSize: '48px', lineHeight: '50px' }}>
                                        LOOP3D SMART Action Plan
                                    </h3>
                                    <p className="font-poppins text-black" style={{ fontSize: '18px' }}>
                                        This report is designed to highlight both strengths and developmental opportunities for you within your role.
                                    </p>

                                    <div className="summary_inner_box" style={{ backgroundColor: '#fff', padding: '35px 30px', borderRadius: '10px' }}>
                                        <h3 className="font-frank text-black" style={{ fontSize: '35px', lineHeight: '40px' }}>Strengths</h3>
                                        <p className="font-poppins" style={{ fontSize: '20px' }}>
                                        <strong className="font-frank fw-normal" style={{ fontSize: '20px' }}>Summary:</strong> Based on your results, your coworkers particularly appreciate the following strengths in you and the value it adds to the workplace.
                                        </p>

                                        <h4 className="font-frank fw-normal" style={{ fontSize: '20px' }}>SMART Plan:</h4>
                                        {summaryArray?.smart_plan?.map((plan, index) => (
                                        <p key={index}>{plan}</p>
                                        ))}
                                    </div>
                                    </div>

                                    <div className="summary-section summary-inner-text mt-5" style={{ backgroundColor: '#fff', padding: '35px 30px', borderRadius: '10px' }}>
                                    <h3 className="font-frank text-black" style={{ fontSize: '35px', lineHeight: '40px', textTransform: 'capitalize' }}>Development Opportunities</h3>
                                    <p className="font-poppins" style={{ fontSize: '20px' }}>
                                        <strong className="font-frank fw-normal" style={{ fontSize: '20px' }}>Summary:</strong> Based on your results, your coworkers have identified potential areas for development to further enhance your skills.
                                    </p>

                                    <h4 className="font-frank fw-normal" style={{ fontSize: '20px' }}>SMART Plan:</h4>
                                    {summaryArray?.smart_plan_opportunities?.map((plan, index) => {
                                        // Split the plan string by points (e.g., "1.", "2.", etc.)
                                        const splitPlan = plan?.split(/(?=\d\.\s)/); // Use regex to split on numbers followed by a period and space
                                        return (
                                        <div key={index}>
                                            {splitPlan.map((point, idx) => (
                                            <p key={idx}>{point.trim()}</p> // Trim whitespace from each point
                                            ))}
                                        </div>
                                        );
                                    })}
                                    </div>
                                </div>
                                )}
                        </div>
                        <div className="row ready_box mt-5">
                            <div className="col-lg-6">
                                <p className="text-poppins fw-bold text-black" style={{ fontSize: '18px', lineHeight: '24px', maxWidth: '565px' }}>Are you ready to take your development to the next level with
                                    your very own A.I. professional development coach?</p>
                                <button className="btn font-poppins mt-4" style={{ minWidth: '329px', backgroundColor: '#174A6D', color: '#fff', fontSize: '16px', minHeight: '56px', lineHeight: '56px', borderRadius: '50px' }}>Launch Development Coach Chat</button>
                            </div>
                            <div className="col-lg-6">
                                <p className="text-poppins fw-bold text-black" style={{ fontSize: '18px', lineHeight: '24px', maxWidth: '565px' }}>Are you ready to Take your feedback to the next level with
                                    our A.I. powered development planning tool.</p>
                                <button className="btn font-poppins mt-4" style={{ minWidth: '329px', backgroundColor: '#174A6D', color: '#fff', fontSize: '16px', minHeight: '56px', lineHeight: '56px', borderRadius: '50px' }}>Launch Development Plan</button>
                            </div>

                        </div> 
                    </div>
                    < Button className="generate-btn" onClick={() => {generatePdf()}}>Download as PDF</Button>

                </Container>
            ) :<div style={{textAlign: "center", marginTop: "15%"}}><Loading/></div>
        }
    {/* {pdf&&<SummaryPdf
        reportRef={reportRef}
            completedResponses={completedResponses}
            totals={totals}
            reportData={reportData}
            participants={participants}
            competencyReport={competencyReport}
            survey={survey}
            loader={loader}
            renderTableRows={renderTableRows}
            totalInvited={totalInvited}
            totalCompleted={totalCompleted}
            summaryArray={summaryArray}
        />} */}
      
        </div>
    </AuthLayout>
     
    ); 

    // {pdf&&<SummaryPdf
    //     reportRef={reportRef}
    //         completedResponses={completedResponses}
    //         totals={totals}
    //         reportData={reportData}
    //         participants={participants}
    //         competencyReport={competencyReport}
    //         survey={survey}
    //         loader={loader}
    //         renderTableRows={renderTableRows}
    //         totalInvited={totalInvited}
    //         totalCompleted={totalCompleted}
    //         summaryArray={summaryArray}
    //     />}
};

export default SurveySummary;
