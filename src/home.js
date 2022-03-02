import { useState, useEffect, useCallback } from "react"
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "./home.css"

const HomeView = ()=>{
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState("");
    
    const updateData = useCallback(()=>{
        if(currentUser != null){
            fetch(`${process.env.REACT_APP_API_URL}/vitals?user=${currentUser}`)
            .then(res => res.json())
            .then(
              (result) => {
                if (result){
                    result.sort((a,b)=>{
                        return a.timestamp.$date - b.timestamp.$date;
                    })
                    setData(result)
                }
              },
            )
        }
    },[currentUser]);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/users`)
        .then(res=>res.json())
        .then(
            (result)=>{
                setUsers(result)
            }
        )
        const interval = setInterval(()=>{updateData()}, 2000);
        return () => clearInterval(interval);
    },[updateData])


    const formatTimestamp = (tickItem)=>{
        try{
            return  new Intl
            .DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
            .format(tickItem)
        }catch{
            return null;
        }
    }

    const hrToolTip = ({active, payload, label})=>{
        if (active && payload && payload.length) {
            return (
              <div className="recharts-tooltip-wrapper"
                style={{
                    "backgroundColor":"white",
                    "border": "1px solid #AAAAAA",
                    "padding": "5px",
                    "lineHeight": "5px"
                }}
              >
                <p></p>
                <p className="label">{`${formatTimestamp(label)}`}</p>
                <p className="label">{`HR : ${payload[0].value} bpm`}</p>
              </div>
            );
          }
          return null;
    };

    return(
        <Container
            style={{
                "paddingTop": "40px"
            }}
        >
            <Row style={{
                "textAlign":"center",
                "paddingBottom": "20px"
            }}
            >
                <h1>Select a user below and retrieve data from database.</h1>
            </Row>

            <Row style={{
                "paddingBottom": "30px"
            }}>
                <Col md={{ span: 3, offset: 4 }}>
                    <Form.Select 
                        value={currentUser}
                        onChange={e=>setCurrentUser(e.target.value)}>
                        
                        <option key="empty" value=""></option>
                        {users.map((user, idx)=>{
                            return (
                                <option key={idx} value={user._id.$oid}>{user.username}</option>
                                )
                            }
                        )}
                    </Form.Select> 
                </Col>
                <Col md={{ span: 1}}>
                    <Button onClick={(e)=>updateData()}>Refresh</Button>
                </Col>
            </Row>
            
            <Row style={{"textAlign":"center", "margin": "auto"}}>
                <Col md={{ span: 6 }} style={{"height": "450px"}}>
                    <p> Heart Rate </p>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}
                            margin={{right: 30, left: 0}}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp.$date" tickFormatter={formatTimestamp}/>
                            <YAxis 
                                domain={[40, 130]}
                                label={{ value: 'Heart Rate / bpm', angle: -90, position: 'insideLeft' }}    
                            />
                            <Tooltip content={hrToolTip}/>
                            <Line type="monotone" dataKey="hr" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer> 
                </Col>

                <Col md={{ span: 6 }} style={{"height": "450px"}}>
                    <p> Temperature </p>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}
                            margin={{right: 30, left: 0}}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp.$date" tickFormatter={formatTimestamp}/>
                            <YAxis 
                                domain={[34, 38]}
                                label={{ value: 'Temperature / °C', angle: -90, position: 'insideLeft' }}    
                            />
                            <Tooltip />
                            <Line type="monotone" dataKey="temp" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer> 
                </Col>
            </Row>
        </Container>
    )
}

export default HomeView