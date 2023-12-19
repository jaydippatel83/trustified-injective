import React, { useEffect, useState } from 'react';
import { networkURL } from '../config';
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link, useParams } from 'react-router-dom';
import { firebaseDataContext } from '../context/FirebaseDataContext';
import UploadPreview from './claim/UploadPreview';
const CollectionDetail = () => {
    const { id } = useParams();
    const firebaseContext = React.useContext(firebaseDataContext);
    const { getClaimer, claimer } = firebaseContext;
    const [certificateId, setId] = useState("");

    useEffect(() => {
        getClaimer(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getUrl = (chain) => {
        const url = networkURL[chain];
        return url;
    };

    const goBack = () => {
        window.history.back();
    };

    const shortAddress = (addr) =>
        addr.length > 10 && addr.startsWith("0x")
            ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
            : addr;

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        if (typeof date === 'string') {
            return new Date(date).toLocaleDateString(undefined, options);
        } else if (typeof date === 'object') {
            const formattedDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
            return formattedDate.toLocaleDateString(undefined, options);
        }
        return ''; // Return an empty string for invalid date formats
    };
  


    async function getCertId() {
        let network = getNetworkToken(claimer?.chain);

        var certId = `${network}#${claimer?.eventId}#${claimer?.tokenId}`;
        setId(certId);
    }
    useEffect(() => {
        getCertId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [claimer]);

    const getNetworkToken = (network) => {
        var net;
        if (network === "fvmtestnet") {
            net = "fvmtestnet";
        } else if (network === "fvm") {
            net = "fvm";
        } else if (network === "mumbai") {
            net = "mumbai";
        } else if (network === "polygon") {
            net = "polygon";
        } else if (network === "celotestnet") {
            net = "celotestnet";
        } else if (network === "celomainnet") {
            net = "celo";
        } else if (network === "arbitrumtestnet") {
            net = "arbitrumtestnet";
        } else if (network === "ethereumtestnet") {
            net = "ethereumtestnet";
        } else if (network === "apothem") {
            net = "apothem";
        } else {
            net = "bsc";
        }
        return net;
    };

    return (
        <section className="footer-position" id="banner">
            <div className="bannercontainer container">
                <button
                    className="thm-btn header__cta-btn"
                    onClick={goBack}
                >
                    <span>Go Back</span>
                </button>
                <div className="row">
                    <div className="col-xl-8 col-lg-8 col-12 col-md-8 col-sm-10 mx-auto">
                        <div className="banner-one__claimcontent">

                            {claimer?.type === "badge" ? (
                                <Link
                                    to={claimer?.ipfsurl}
                                    target="_blank"
                                >
                                    <img className="claimBadge my-5" src={claimer?.ipfsurl} alt="" />
                                </Link>
                            ) : (  
                               <div className='py-4'>
                                 <UploadPreview claimer={claimer} id="" /> 
                               </div>
                            )}
                            <div
                                className="justify-content-center"
                                style={{ margin: "auto" }}
                            >
                                <div className="card-root claim-card">
                                    <div className="justify-content-center d-flex">
                                        <h4 className="card-h4 claim-h4">{claimer?.title}</h4>
                                    </div>
                                    <p className="card-p claim-des">{claimer?.description}</p>

                                    <div
                                        className="card-body-cert d-flex"
                                        style={{ justifyContent: "space-evenly" }}
                                    >
                                        {claimer?.type === "certificate" && (
                                            <div>
                                                <h4>Certificate Id</h4>
                                                <p>{claimer?.type === "certificate" ? certificateId : claimer?.id}</p>
                                            </div>
                                        )}
                                        <div>
                                            <h4>TokenId</h4>
                                            <p>#{claimer?.tokenId}</p>
                                        </div>
                                        <div>
                                            <h4>Network</h4>
                                            <p style={{ textTransform: "capitalize" }}>
                                                {claimer?.chain}
                                            </p>
                                        </div>
                                        <div>
                                            <h4>Type</h4>
                                            <p>
                                                {claimer?.nfttype === "on"
                                                    ? "Non-Transferrable"
                                                    : "Transferrable"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='d-flex py-4 justify-content-around'>
                                        <div className='text-center'>
                                            <h4>Issue By</h4>
                                            <p>
                                                {claimer?.createdBy && shortAddress(claimer?.createdBy)}
                                            </p>
                                        </div>
                                        <div className='text-center'>
                                            <h4>Issue Date</h4>
                                            <p>
                                                {formatDate(claimer?.issueDate)}
                                            </p>
                                        </div>
                                    </div>
                                    <a
                                        href={`${getUrl(claimer?.chain)}/${claimer?.txHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Transaction <OpenInNewIcon />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CollectionDetail;