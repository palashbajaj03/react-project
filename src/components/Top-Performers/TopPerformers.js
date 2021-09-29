import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import './TopPerformers.css'

export default class TopPerformers extends Component {
    render() {
        return (
            <React.Fragment>
        <div className="col-lg-4 col-md-12 col-sm-12 ">
                        <div className="custom-component mt25">
                            <h4 className="component-title"> Top Performing Team </h4>
                            <div className="media-box mt20">
                                <div className="media-img">
                                    <img src="/static/images/paul.jpg" alt="img" />
                                </div>
                                <div className="media-detail">
                                    <h4 className="media-name"> Paul's Team</h4>
                                    <p className="media-pra"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard </p>
                                </div>
                            </div>
                            <div className="custom-tab mt25">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="Performance1-tab" data-toggle="tab" href="#Performance1" role="tab" aria-controls="home" aria-selected="true">Performance</a>
                                    </li>
                                    <li className="nav-item text-center">
                                        <a className="nav-link " id="Customers1-tab" data-toggle="tab" href="#Customers1" role="tab" aria-controls="profile" aria-selected="false">Top Customers</a>
                                    </li>
                                    <li className="nav-item text-right">
                                        <a className="nav-link " id="Profile1-tab" data-toggle="tab" href="#Profile1" role="tab" aria-controls="contact" aria-selected="false">Profile</a>
                                    </li>
                                </ul>
                                <div className="tab-content mt20" id="myTabContent">
                                    <div className="tab-pane fade show active" id="Performance1" role="tabpanel" aria-labelledby="Performance1-tab">
                                        <h4 className="total-coversation"> Total conversations <strong>12,34,567</strong></h4>
                                        <div className="custom-progress">
                                            <div className="prog-heading">
                                                <span className="prog-round mr15 bg-blue"></span>
                                                <h5 className="progress-text"> Consideration : <strong> 30% </strong> of total conversation </h5>
                                            </div>
                                            <div className="progress prog-wrapp">
                                                <div className="progress-bar bg-blue" role="progressbar" style={{width: "30%"}} aria-valuenow="30" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                        <div className="custom-progress">
                                            <div className="prog-heading">
                                                <span className="prog-round mr15 bg-green"></span>
                                                <h5 className="progress-text"> Consideration : <strong> 45% </strong> of total conversation </h5>
                                            </div>
                                            <div className="progress prog-wrapp">
                                                <div className="progress-bar bg-green" role="progressbar" style={{width: "45%"}} aria-valuenow="45" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                        <div className="custom-progress mb25">
                                            <div className="prog-heading">
                                                <span className="prog-round mr15  bg-sky-blue "></span>
                                                <h5 className="progress-text"> Consideration : <strong> 25% </strong> of total conversation </h5>
                                            </div>
                                            <div className="progress prog-wrapp">
                                                <div className="progress-bar bg-blue" role="progressbar" style={{width: "25%"}} aria-valuenow="25" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="tab-pane fade" id="Customers1" role="tabpanel" aria-labelledby="Customers1-tab">Comming Soon</div>
                                    <div className="tab-pane fade" id="Profile1" role="tabpanel" aria-labelledby="Profile1-tab">Comming Soon</div>
                                </div>
                            </div>
                            <div className="see-all">
                                <Link to="collection" className="see-all-text"> See All Collection  </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-12 col-sm-12 ">
                        <div className="custom-component mt25">
                            <h4 className="component-title"> Top Performing Team </h4>
                            <div className="media-box mt20">
                                <div className="media-img">
                                    <img src="/static/images/william.jpg" alt="img" />
                                </div>
                                <div className="media-detail">
                                    <h4 className="media-name"> Christopher Williams </h4>
                                    <p className="media-pra"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard </p>
                                </div>
                            </div>
                            <div className="custom-tab mt25">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="Performance2-tab" data-toggle="tab" href="#Performance2" role="tab" aria-controls="home" aria-selected="true">Performance</a>
                                    </li>
                                    <li className="nav-item text-center">
                                        <a className="nav-link " id="customer2-tab" data-toggle="tab" href="#customer2" role="tab" aria-controls="profile" aria-selected="false">Top Customers</a>
                                    </li>
                                    <li className="nav-item text-right">
                                        <a className="nav-link " id="profile2-tab" data-toggle="tab" href="#profile2" role="tab" aria-controls="contact" aria-selected="false">Profile</a>
                                    </li>
                                </ul>
                                <div className="tab-content mt20" id="myTabContent">
                                    <div className="tab-pane fade show active" id="Performance2" role="tabpanel" aria-labelledby="Performance2-tab">
                                        <h4 className="total-coversation"> Total conversations <strong>12,34,567</strong></h4>
                                        <div className="custom-progress">
                                            <div className="prog-heading">
                                                <span className="prog-round mr15 bg-blue"></span>
                                                <h5 className="progress-text"> Consideration : <strong> 30% </strong> of total conversation </h5>
                                            </div>
                                            <div className="progress prog-wrapp">
                                                <div className="progress-bar bg-blue" role="progressbar" style={{width: "30%"}} aria-valuenow="30" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                        <div className="custom-progress">
                                            <div className="prog-heading">
                                                <span className="prog-round mr15 bg-green"></span>
                                                <h5 className="progress-text"> Consideration : <strong> 45% </strong> of total conversation </h5>
                                            </div>
                                            <div className="progress prog-wrapp">
                                                <div className="progress-bar bg-green" role="progressbar" style={{width: "45%"}} aria-valuenow="45" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                        <div className="custom-progress mb25">
                                            <div className="prog-heading">
                                                <span className="prog-round mr15  bg-sky-blue "></span>
                                                <h5 className="progress-text"> Consideration : <strong> 25% </strong> of total conversation </h5>
                                            </div>
                                            <div className="progress prog-wrapp">
                                                <div className="progress-bar bg-blue" role="progressbar" style={{width: "25%"}} aria-valuenow="25" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="tab-pane fade" id="customer2" role="tabpanel" aria-labelledby="customer2-tab">Comming Soon</div>
                                    <div className="tab-pane fade" id="profile2" role="tabpanel" aria-labelledby="profile2-tab">Comming sssSoon</div>
                                </div>
                            </div>
                            <div className="see-all">
                                <Link to="collection" className="see-all-text"> See All Collection  </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-12 col-sm-12 ">
                        <div className="custom-component mt25">
                            <h4 className="component-title"> Top Performing Team </h4>
                            <div className="media-box mt20">
                                <div className="media-img">
                                    <img src="/static/images/ronald.jpg" alt="img" />
                                </div>
                                <div className="media-detail">
                                    <h4 className="media-name"> Paul's Team</h4>
                                    <p className="media-pra"> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard </p>
                                </div>
                            </div>
                            <div className="custom-tab mt25">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" id="performance3-tab" data-toggle="tab" href="#performance3" role="tab" aria-controls="home" aria-selected="true">Performance</a>
                                    </li>
                                    <li className="nav-item text-center">
                                        <a className="nav-link " id="customers3-tab" data-toggle="tab" href="#customers3" role="tab" aria-controls="profile" aria-selected="false">Top Customers</a>
                                    </li>
                                    <li className="nav-item text-right">
                                        <a className="nav-link " id="profile3-tab" data-toggle="tab" href="#profile3" role="tab" aria-controls="contact" aria-selected="false">Profile</a>
                                    </li>
                                </ul>
                                <div className="tab-content mt20" id="myTabContent">
                                    <div className="tab-pane fade show active" id="performance3" role="tabpanel" aria-labelledby="performance3-tab">
                                        <h4 className="total-coversation"> Total conversations <strong>12,34,567</strong></h4>
                                        <div className="custom-progress">
                                            <div className="prog-heading">
                                                <span className="prog-round mr15 bg-blue"></span>
                                                <h5 className="progress-text"> Consideration : <strong> 30% </strong> of total conversation </h5>
                                            </div>
                                            <div className="progress prog-wrapp">
                                                <div className="progress-bar bg-blue" role="progressbar" style={{width: "30%"}} aria-valuenow="30" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                        <div className="custom-progress">
                                            <div className="prog-heading">
                                                <span className="prog-round mr15 bg-green"></span>
                                                <h5 className="progress-text"> Consideration : <strong> 45% </strong> of total conversation </h5>
                                            </div>
                                            <div className="progress prog-wrapp">
                                                <div className="progress-bar bg-green" role="progressbar" style={{width: "45%"}} aria-valuenow="45" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                        <div className="custom-progress mb25">
                                            <div className="prog-heading">
                                                <span className="prog-round mr15  bg-sky-blue "></span>
                                                <h5 className="progress-text"> Consideration : <strong> 25% </strong> of total conversation </h5>
                                            </div>
                                            <div className="progress prog-wrapp">
                                                <div className="progress-bar bg-blue" role="progressbar" style={{width: "25%"}} aria-valuenow="25" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="tab-pane fade" id="customers3" role="tabpanel" aria-labelledby="customers3-tab">Comming Soon dddd</div>
                                    <div className="tab-pane fade" id="profile3" role="tabpanel" aria-labelledby="profile3-tab">Comming Soon sdaasd</div>
                                </div>
                            </div>
                            <div className="see-all">
                            <Link to="collection"  className="see-all-text"> See All Collection  </Link>
                            </div>
                        </div>
                    </div>
</React.Fragment>
        )
    }
}
