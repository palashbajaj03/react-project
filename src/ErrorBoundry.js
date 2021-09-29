import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //   logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <React.Fragment>
          <div className="start-all-search error-page" style={{height:'100vh'}}>
          <div className="conversation-inner-wrapp mt25">
            <div className="emptyBox" style={{margin:'130px auto'}}>
              <div className="msgImage">
                <img src="/static/images/search-empty.svg" alt="search-empty" />
                <h1 style={{margin:'10px'}}>Ahh! Something went wrong.</h1>
                <h5>Brace yourself till we get the error fixed</h5>
                <h5 style={{marginBottom: "20px"}}>You may refresh the page or try again later</h5>
                  <a href="/dashboard"><button className="btn btn-secondary">Go back Home </button></a>
              </div>
            </div>
          </div>
          </div>

        </React.Fragment>
      )
    }
    return this.props.children;
  }
}

