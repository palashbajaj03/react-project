import React from 'react'

function ConversationProductMention(props) {
    return (
        <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="custom-component mt25 total-expert-keyword">
            <div>
              <h4 className="component-title"> Top Product Mentions </h4>
              <p className="component-title-text"> Number of conversations with products mentioned  </p>
            </div>

            <div className="total-expert-body mt25">
              <div className="total-expert-row">
                <div className="recent-deatil">
                  <div className="conver-oval mr15">1</div>
                  <div className="total-expert-text">
                    <h5> Email </h5>
                    <small className="total-expert-small-text"> Occured in 60 conversations </small>

                  </div>
                </div>
                <div className="total-expert-result">
                  <span className="competition-text"> 180 </span>
                  <span className="added-text small-side-text">+1 Added</span>
                </div>
              </div>

              <div className="recent-deatil-row">
                <div className="recent-deatil">
                  <div className="conver-oval mr15">2</div>
                  <div className="total-expert-text">
                    <h5> SMS </h5>
                    <small className="total-expert-small-text"> Occured in 60 conversations </small>

                  </div>
                </div>
                <div className="total-expert-result">
                  <span className="competition-text"> 70 </span>
                  <span className="added-text small-side-text">+5 Added</span>
                </div>
              </div>

              <div className="recent-deatil-row">
                <div className="recent-deatil">
                  <div className="conver-oval mr15">3</div>
                  <div className="total-expert-text">
                    <h5> Web Message </h5>
                    <small className="total-expert-small-text"> Occured in 60 conversations </small>

                  </div>
                </div>
                <div className="total-expert-result">
                  <span className="competition-text "> 70 </span>
                  <span className="removed-text small-side-text">-1 Removed</span>
                </div>
              </div>

              <div className="recent-deatil-row">
                <div className="recent-deatil">
                  <div className="conver-oval mr15">4</div>
                  <div className="total-expert-text">
                    <h5> Web Message </h5>
                    <small className="total-expert-small-text"> Occured in 60 conversations </small>

                  </div>
                </div>
                <div className="total-expert-result">
                  <span className="competition-text"> 70 </span>
                  <span className="added-text small-side-text">+2 Added</span>
                </div>
              </div>

              <div className="recent-deatil-row">
                <div className="recent-deatil">
                  <div className="conver-oval mr15">5</div>
                  <div className="total-expert-text">
                    <h5> Web Personalisation </h5>
                    <small className="total-expert-small-text"> Occured in 60 conversations </small>

                  </div>
                </div>
                <div className="total-expert-result">
                  <span className="competition-text"> 70 </span>
                  <span className="removed-text small-side-text">-1 Removed</span>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    )
}
export default ConversationProductMention