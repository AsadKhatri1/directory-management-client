import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { Audio } from "react-loader-spinner";
// Configure Cloudinary with your credentials

const ResidentForm = () => {
  const backendURL = "https://directory-management-g8gf.onrender.com";
  const [FullName, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [HouseNumber, setHouseNumber] = useState("");
  const [Profession, setProfession] = useState("");
  const [officeTel, setOfficeTel] = useState("");
  const [Qualification, setQualification] = useState("");
  const [bAddress, setBAddress] = useState("");
  const [NOCHolder, setNOCHolder] = useState("");
  const [NOCIssue, setNOCIssue] = useState("");
  const [NOCNo, setNOCNo] = useState("");
  const [DOB, setDOB] = useState("");
  const [CNIC, setCNIC] = useState("");
  const [Photo, setPhoto] = useState("");
  const [cnicFile, setCnicFile] = useState("");
  const [nocFile, setNocFile] = useState("");
  const [cantPass, setCantPass] = useState("");
  const [policeV, setPoliceV] = useState("");
  const [lisence, setLisence] = useState("");
  const [loader, setLoader] = useState(false);

  const [vehicles, setVehicles] = useState([
    {
      type: "",
      make: "",
      model: "",
      year: "",
      colour: "",
      stickerNumber: "",
      registrationNumber: "",
      paperDocument: "",
    },
  ]);
  const [maids, setMaids] = useState([
    {
      name: "",
      dob: "",
      address: "",
      guardian: "",
      number: "",
      cnic: "",
      cnicUrl: "",
      cantPassUrl: "",
    },
  ]);

  const navigate = useNavigate();

  // show family members form

  const [showFam, setShowFam] = useState(false);
  const [showVehicle, setShowVehicle] = useState(false);
  const [showTanent, setShowTanent] = useState(false);
  const [showServant, setShowServant] = useState(false);
  const [showForm, setShowForm] = useState(true);

  // upload single files to cloudinary
  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images_preset");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.secure_url;
    } else {
      throw new Error(`Failed to upload file: ${file.name}`);
    }
  };

  //--------------------- function for submitting form ----------------------
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      // Upload photo to Cloudinary
      let photoUrl;
      if (Photo) {
        photoUrl = await uploadFileToCloudinary(Photo);
      }

      // Upload CNIC
      let cnicUrl;
      if (cnicFile) {
        cnicUrl = await uploadFileToCloudinary(cnicFile);
      }

      // Upload NOC
      let nocUrl;
      if (nocFile) {
        nocUrl = await uploadFileToCloudinary(nocFile);
      }

      // Upload cant Pass
      let cantUrl;
      if (cantPass) {
        cantUrl = await uploadFileToCloudinary(cantPass);
      }
      // Upload pol veri
      let polUrl;
      if (policeV) {
        polUrl = await uploadFileToCloudinary(policeV);
      }
      // Upload lisence
      let lUrl;
      if (lisence) {
        lUrl = await uploadFileToCloudinary(lisence);
      }

      const response = await axios.post(
        `${backendURL}/api/v1/resident/add`,
        {
          FullName,
          Email,
          Phone,
          HouseNumber,
          CNIC,
          Profession,
          Qualification,
          DOB,
          NOCHolder,
          bAddress,
          officeTel,
          NOCIssue,
          NOCNo,
          vehicles,
          relatives,
          tanents,
          maids,
          Photo: photoUrl,
          CnicFile: cnicUrl,
          NocFile: nocUrl,
          CantFile: cantUrl,
          VerificationFile: polUrl,
          LisenceFile: lUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include 'Bearer' prefix for most token types
          },
        }
      );
      if (response.data.success) {
        console.log(response.data);
        toast.success(response.data.message);
        setCNIC("");
        setEmail("");
        setFullName("");
        setHouseNumber("");
        setProfession("");
        setQualification("");
        setPhone("");
        navigate("/dashboard/residents");
      }
    } catch (err) {
      toast.error(err?.response?.data.message);
      setLoader(false);
    }
  };

  // uploading car papers to cloudinary
  const handlePaperDocumentUpload = async (event, index) => {
    const file = event.target.files[0];

    if (!file) {
      return; // No file selected, do nothing
    }

    try {
      let uploadedUrl;

      // Upload image to Cloudinary if it's an image (optional):

      uploadedUrl = await uploadFileToCloudinary(file);

      // Update vehicle array with uploaded URL
      setVehicles((prevVehicles) => {
        const updatedVehicles = [...prevVehicles];
        updatedVehicles[index].paperDocument = uploadedUrl;
        return updatedVehicles;
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Error uploading document. Please try again."); // Inform the user
    }
  };

  // uploading relative cnic and photo
  const handleRelativePhotoUpload = async (index, event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      let uploadedUrl;

      // Upload photo to Cloudinary based on file type

      uploadedUrl = await uploadFileToCloudinary(file);

      // Update relatives array with uploaded photo URL
      setRelatives((prevRelatives) => {
        const updatedRelatives = [...prevRelatives];
        updatedRelatives[index].photoUrl = uploadedUrl;
        return updatedRelatives;
      });
    } catch (error) {
      console.error("Error uploading relative photo:", error);
      alert("Error uploading photo. Please try again.");
    }
  };
  const handleRelativeCnicUpload = async (index, event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      let uploadedUrl;

      // Upload photo to Cloudinary based on file type

      uploadedUrl = await uploadFileToCloudinary(file);

      // Update relatives array with uploaded photo URL
      setRelatives((prevRelatives) => {
        const updatedRelatives = [...prevRelatives];
        updatedRelatives[index].cnicUrl = uploadedUrl;
        return updatedRelatives;
      });
    } catch (error) {
      console.error("Error uploading relative photo:", error);
      alert("Error uploading photo. Please try again.");
    }
  };
  // uploading tanent cnic and photo
  const handleTanentPhotoUpload = async (index, event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      let uploadedUrl;

      // Upload photo to Cloudinary based on file type

      uploadedUrl = await uploadFileToCloudinary(file);

      // Update relatives array with uploaded photo URL
      setTanents((prevTanents) => {
        const updatedTanents = [...prevTanents];
        updatedTanents[index].photoUrl = uploadedUrl;
        return updatedTanents;
      });
    } catch (error) {
      console.error("Error uploading relative photo:", error);
      alert("Error uploading photo. Please try again.");
    }
  };
  const handleTanentCnicUpload = async (index, event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      let uploadedUrl;

      // Upload photo to Cloudinary based on file type

      uploadedUrl = await uploadFileToCloudinary(file);

      // Update relatives array with uploaded photo URL
      setTanents((prevTanents) => {
        const updatedTanents = [...prevTanents];
        updatedTanents[index].cnicUrl = uploadedUrl;
        return updatedTanents;
      });
    } catch (error) {
      console.error("Error uploading relative photo:", error);
      alert("Error uploading photo. Please try again.");
    }
  };
  const handleTanentNocUpload = async (index, event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      let uploadedUrl;

      // Upload photo to Cloudinary based on file type

      uploadedUrl = await uploadFileToCloudinary(file);

      // Update relatives array with uploaded photo URL
      setTanents((prevTanents) => {
        const updatedTanents = [...prevTanents];
        updatedTanents[index].nocUrl = uploadedUrl;
        return updatedTanents;
      });
    } catch (error) {
      console.error("Error uploading relative photo:", error);
      alert("Error uploading photo. Please try again.");
    }
  };

  const handleMaidCantPassUpload = async (index, event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      let uploadedUrl;

      // Upload photo to Cloudinary based on file type

      uploadedUrl = await uploadFileToCloudinary(file);

      // Update maids array with uploaded photo URL
      setMaids((prevMaids) => {
        const updatedMaids = [...prevMaids];
        updatedMaids[index].cantPassUrl = uploadedUrl;
        return updatedMaids;
      });
    } catch (error) {
      console.error("Error uploading maid photo:", error);
      alert("Error uploading photo. Please try again.");
    }
  };
  const handleMaidCnicUpload = async (index, event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      let uploadedUrl;

      // Upload photo to Cloudinary based on file type

      uploadedUrl = await uploadFileToCloudinary(file);

      // Update maids array with uploaded photo URL
      setMaids((prevMaids) => {
        const updatedMaids = [...prevMaids];
        updatedMaids[index].cnicUrl = uploadedUrl;
        return updatedMaids;
      });
    } catch (error) {
      console.error("Error uploading maid photo:", error);
      alert("Error uploading photo. Please try again.");
    }
  };

  const handleVehicleChange = (index, event) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index][event.target.name] = event.target.value;
    setVehicles(updatedVehicles);
  };

  const addVehicleField = () => {
    setVehicles([
      ...vehicles,
      {
        type: "",
        make: "",
        model: "",
        year: "",
        colour: "",
        stickerNumber: "",
        registrationNumber: "",
        paperDocument: "",
      },
    ]);
  };
  // family members
  const [relatives, setRelatives] = useState([
    {
      name: "",
      relation: "",
      dob: "",
      occupation: "",
      cnic: "", // Existing CNIC property
      number: "",
      photoUrl: "", // New property for photo URL
      cnicUrl: "", // New property for CNIC URL (assuming it's an uploaded document)
    },
  ]);

  const handleRelativeChange = (index, name, event) => {
    const { value } = event.target;
    const updatedRelatives = [...relatives];
    updatedRelatives[index][name] = value;
    setRelatives(updatedRelatives);
  };
  const addRelativeField = () => {
    setRelatives([
      ...relatives,
      {
        name: "",
        relation: "",
        dob: "",
        occupation: "",
        cnic: "",
        number: "",
        photoUrl: "",
        cnicUrl: "",
      },
    ]);
  };

  // servants field
  const handleMaidChange = (index, name, event) => {
    const { value } = event.target;
    const updatedMaids = [...maids];
    updatedMaids[index][name] = value;
    setMaids(updatedMaids);
  };

  const addMaidField = () => {
    setMaids([
      ...maids,
      {
        name: "",
        dob: "",
        address: "",
        guardian: "",
        number: "",
        cnic: "",
        cnicUrl: "",
        cantPassUrl: "",
      },
    ]);
  };

  // tanents fields

  const [tanents, setTanents] = useState([
    {
      name: "",

      dob: "",
      occupation: "",
      cnic: "", // Existing CNIC property
      nocIssue: "",
      nocNo: "",
      number: "",
      photoUrl: "", // New property for photo URL
      cnicUrl: "", // New property for CNIC URL (assuming it's an uploaded document)
      nocUrl: "",
    },
  ]);

  const handleTanentChange = (index, name, event) => {
    const { value } = event.target;
    const updatedTanents = [...tanents];
    updatedTanents[index][name] = value;
    setTanents(updatedTanents);
  };
  const addTanentField = () => {
    setTanents([
      ...tanents,
      {
        name: "",
        relation: "",
        dob: "",
        occupation: "",
        cnic: "",
        nocIssue: "",
        nocNo: "",
        number: "",
        photoUrl: "",
        cnicUrl: "",
        nocUrl: "",
      },
    ]);
  };

  return (
    <main className="main-container text-center mt-5">
      <h1 className="my-3 fw-bold">Add A New Resident</h1>
      {showForm && (
        <div className="d-flex w-100 align-items-center justify-content-end px-5">
          {" "}
          <span
            style={{
              fontSize: "24px",
              cursor: "pointer",
              color: "red",
            }}
            onClick={() => setShowForm(false)}
          >
            X
          </span>
        </div>
      )}

      <form action="post" className="w-100 mt-3" onSubmit={submitHandler}>
        {/* new resident starts here */}
        {showForm ? (
          <div className="row">
            <div className="col-md-6">
              <label
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                {Photo ? Photo.name : "Upload image"}
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
              <label
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                {cnicFile ? cnicFile.name : "Upload CNIC"}
                <input
                  type="file"
                  name="cnicFile"
                  accept="image/*, .pdf"
                  onChange={(e) => setCnicFile(e.target.files[0])}
                  hidden
                />
              </label>
              <label
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                {nocFile ? nocFile.name : "Upload NOC "}
                <input
                  type="file"
                  name="nocFile"
                  accept="image/*, .pdf"
                  onChange={(e) => setNocFile(e.target.files[0])}
                  hidden
                />
              </label>
              <label
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                {cantPass ? cantPass.name : "Upload Cant Pass"}
                <input
                  type="file"
                  name="nocFile"
                  accept="image/* ,.pdf"
                  onChange={(e) => setCantPass(e.target.files[0])}
                  hidden
                />
              </label>
              <label
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                {policeV ? policeV.name : "Upload Police Verification"}
                <input
                  type="file"
                  name="nocFile"
                  accept="image/*,.pdf"
                  onChange={(e) => setPoliceV(e.target.files[0])}
                  hidden
                />
              </label>
              <label
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              >
                {lisence ? lisence.name : "Upload Driving Lisence"}
                <input
                  type="file"
                  name="nocFile"
                  accept="image/*,.pdf"
                  onChange={(e) => setLisence(e.target.files[0])}
                  hidden
                />
              </label>
              {/* </div> */}
              <input
                value={FullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                name="FullName"
                id="FullName"
                placeholder="Full Name"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />
              <br />
              <input
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="Email"
                id="Email"
                placeholder="Email"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />
              <br />
              <input
                value={Profession}
                onChange={(e) => setProfession(e.target.value)}
                type="text"
                name="Profession"
                id="Profession"
                placeholder="Profession"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />
              <br />
              <input
                value={Qualification}
                onChange={(e) => setQualification(e.target.value)}
                type="text"
                name="Profession"
                id="Profession"
                placeholder="Qualification"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />
            </div>
            <div className="col-md-6">
              <input
                value={Phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                name="Phone"
                minLength="11"
                id="Phone"
                placeholder="Phone Number"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />{" "}
              <br />
              <input
                value={HouseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                type="text"
                name="HouseNumber"
                id="HouseNumber"
                placeholder="House Number"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />
              <br />
              <input
                value={CNIC}
                onChange={(e) => setCNIC(e.target.value)}
                type="text"
                name="CNIC"
                id="CNIC"
                placeholder="CNIC"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />
              <br />
              <label htmlFor="date">Date Of Birth</label> <br />
              <input
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
                type="date"
                name="date"
                id="date"
                placeholder="Date Of Birth"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />{" "}
              <input
                value={officeTel}
                onChange={(e) => setOfficeTel(e.target.value)}
                type="tel"
                name="officeTel"
                id="office tel"
                placeholder="Tel (office)"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />
              <br />
              <textarea
                value={bAddress}
                onChange={(e) => setBAddress(e.target.value)}
                type="text"
                name="business address"
                id="business address"
                placeholder="Business/Office Address"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />{" "}
              <br />
              <input
                value={NOCHolder}
                onChange={(e) => setNOCHolder(e.target.value)}
                type="text"
                name="noc"
                id="noc"
                placeholder="NOC Holder's Name"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />{" "}
              <br />
              <label htmlFor="nocIssue mt-2">Date Of NOC Issuance</label>
              <input
                value={NOCIssue}
                onChange={(e) => setNOCIssue(e.target.value)}
                type="date"
                name="nocIssue"
                id="nocIssue"
                placeholder="NOC Issueance Date"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />{" "}
              <br />
              <input
                value={NOCNo}
                onChange={(e) => setNOCNo(e.target.value)}
                type="text"
                name="nocno"
                id="nocno"
                placeholder="NOC Number"
                className="w-75 my-3 text-white py-2"
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid white",
                  borderRadius: "12px",
                  textIndent: "12px",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                }}
              />
              <br />
            </div>
          </div>
        ) : (
          <div className="w-100 d-flex align-items-center justify-content-center ">
            <MdKeyboardDoubleArrowDown
              onClick={() => setShowForm(true)}
              // className="col-md-2 cards my-2"
              style={{
                fontSize: "34px",
                cursor: "pointer",
                color: "green",
              }}
            />
          </div>
        )}

        <div className="row my-3 w-100 d-flex gap-5 justify-content-center">
          <div
            className="col-md-2 cards "
            onClick={() => {
              setShowFam(!showFam),
                setShowForm(false),
                setShowServant(false),
                setShowTanent(false),
                setShowVehicle(false);
            }}
            style={{
              boxShadow: "0px 1px 7px #03bb50",
              cursor: "pointer",
            }}
          >
            {showFam ? "Hide Family Member Form" : "Add Family Members"}
          </div>
          <div
            className="col-md-2 cards"
            onClick={() => {
              setShowFam(false),
                setShowForm(false),
                setShowServant(!showServant),
                setShowTanent(false),
                setShowVehicle(false);
            }}
            style={{
              boxShadow: "0px 1px 7px #03bb50",
              cursor: "pointer",
            }}
          >
            {showServant ? "Hide Servant Form" : "Add Servant"}
          </div>
          <div
            className="col-md-2 cards"
            onClick={() => {
              setShowFam(false),
                setShowForm(false),
                setShowServant(false),
                setShowTanent(false),
                setShowVehicle(!showVehicle);
            }}
            style={{
              boxShadow: "0px 1px 7px #03bb50",
              cursor: "pointer",
            }}
          >
            {showVehicle ? "Hide Vehicle Form" : "Add Vehicle"}
          </div>
          <div
            className="col-md-2 cards"
            onClick={() => {
              setShowFam(false),
                setShowForm(false),
                setShowServant(false),
                setShowTanent(!showTanent),
                setShowVehicle(false);
            }}
            style={{
              boxShadow: "0px 1px 7px #03bb50",
              cursor: "pointer",
            }}
          >
            {showTanent ? "Hide Tanent Form" : "Add Tanent"}
          </div>
        </div>

        {/* family members starts here */}
        {showFam && (
          <div className="row">
            <hr />
            <h1 className="my-3 fw-bold text-center">Enter Family Members</h1>
            {relatives.map((relative, index) => (
              <>
                <div className="col-md-6">
                  <div key={index}>
                    <input
                      value={relative.name}
                      onChange={(e) => handleRelativeChange(index, "name", e)}
                      type="text"
                      name="name"
                      placeholder="Faily Member Name"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <select
                      value={relative.relation}
                      onChange={(e) =>
                        handleRelativeChange(index, "relation", e)
                      }
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      <option
                        value=""
                        style={{
                          background: "black",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                      >
                        Select Relation
                      </option>
                      <option
                        style={{
                          background: "black",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                        value="Father"
                      >
                        Father
                      </option>
                      <option
                        value="Mother"
                        style={{
                          background: "black",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                      >
                        Mother
                      </option>
                      <option
                        value="Husband/Wife"
                        style={{
                          background: "black",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                      >
                        Husband/Wife
                      </option>
                      <option
                        value="Child"
                        style={{
                          background: "black",
                          border: "none",
                          borderBottom: "1px solid white",
                          borderRadius: "12px",
                          textIndent: "12px",
                          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                        }}
                      >
                        Child
                      </option>
                      {/* Add other relation options */}
                    </select>
                    <input
                      value={relative.cnic}
                      onChange={(e) => handleRelativeChange(index, "cnic", e)}
                      type="text"
                      name="cnic"
                      placeholder="CNIC"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <input
                      value={relative.occupation}
                      onChange={(e) =>
                        handleRelativeChange(index, "occupation", e)
                      }
                      type="text"
                      name="occupation"
                      placeholder="Occupation"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <input
                      value={relative.number}
                      onChange={(e) => handleRelativeChange(index, "number", e)}
                      type="tel"
                      name="number"
                      placeholder="Phone No"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <br />
                    <label htmlFor="date">Date Of Birth</label>
                    <br />
                    <input
                      value={relative.dob}
                      onChange={(e) => handleRelativeChange(index, "dob", e)}
                      type="date"
                      name="dob"
                      placeholder="Date Of Birth"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <label
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      {relative.photoUrl
                        ? relative.photoUrl.name
                        : "Upload Photo"}
                      <input
                        type="file"
                        name="nocFile"
                        accept="image/*"
                        onChange={(event) =>
                          handleRelativePhotoUpload(index, event)
                        }
                        hidden
                      />
                    </label>
                    <label
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      {relative.cnicUrl ? relative.cnicUrl.name : "Upload CNIC"}
                      <input
                        type="file"
                        name="nocFile"
                        accept="image/* "
                        onChange={(event) =>
                          handleRelativeCnicUpload(index, event)
                        }
                        hidden
                      />
                    </label>
                  </div>
                </div>
              </>
            ))}
            <div className="w-100 text-center">
              <button
                type="button"
                onClick={addRelativeField}
                className="btn btn-outline-primary m-5 mt-2 w-25 "
              >
                <FaPlus /> Members
              </button>
            </div>
          </div>
        )}

        {/* servant details */}
        {showServant && (
          <div className="row">
            <hr />
            <h1 className="my-3 fw-bold text-center">Enter servant details</h1>
            {maids.map((maid, index) => (
              <>
                <div className="col-md-6">
                  <div key={index}>
                    <input
                      value={maid.name}
                      onChange={(e) => handleMaidChange(index, "name", e)}
                      type="text"
                      name="name"
                      className="w-75 my-3 text-white py-2"
                      placeholder="Servant's Name"
                      // Add your styling here
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <br />
                    <input
                      value={maid.dob}
                      onChange={(e) => handleMaidChange(index, "dob", e)}
                      type="date"
                      name="dob"
                      placeholder="Date Of Birth"
                      // Add your styling here
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <br />
                    <input
                      value={maid.address}
                      onChange={(e) => handleMaidChange(index, "address", e)}
                      type="text"
                      name="address"
                      placeholder="Address"
                      // Add your styling here
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <br />
                    <input
                      value={maid.guardian}
                      onChange={(e) => handleMaidChange(index, "guardian", e)}
                      type="text"
                      name="guardian"
                      placeholder="Guardian's Name"
                      // Add your styling here
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <br />
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <input
                      value={maid.number}
                      onChange={(e) => handleMaidChange(index, "number", e)}
                      type="tel"
                      name="number"
                      placeholder="Phone Number"
                      // Add your styling here
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <br />
                    <input
                      value={maid.cnic}
                      onChange={(e) => handleMaidChange(index, "cnic", e)}
                      type="text"
                      name="cnic"
                      placeholder="CNIC Number"
                      // Add your styling here
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <br />
                    <label
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      {maid.cnicUrl ? maid.cnicUrl.name : "Upload CNIC"}
                      <input
                        type="file"
                        name="cnicFile"
                        accept="image/* "
                        onChange={(event) => handleMaidCnicUpload(index, event)}
                        hidden
                      />
                    </label>
                    <label
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      {maid.cantPassUrl
                        ? maid.cantPassUrl.name
                        : "Upload Cant Pass"}
                      <input
                        type="file"
                        name="cantPassFile"
                        accept="image/*"
                        onChange={(event) =>
                          handleMaidCantPassUpload(index, event)
                        }
                        hidden
                      />
                    </label>
                  </div>
                </div>
              </>
            ))}
            <div className="text-center my-3">
              <button
                type="button"
                onClick={addMaidField}
                className="btn btn-outline-primary w-25 m-5 mt-2"
              >
                <FaPlus /> Servants
              </button>
            </div>
          </div>
        )}

        {/* vehicle details */}
        {showVehicle && (
          <div className="row text-center">
            <hr />
            <h1 className="my-3 fw-bold">Enter vehicle details</h1>
            {vehicles.map((vehicle, index) => (
              <>
                <div className="col-md-6">
                  <div key={index}>
                    {/* selection */}

                    <input
                      value={vehicle.type}
                      onChange={(e) => handleVehicleChange(index, e)}
                      type="text"
                      name="type"
                      placeholder="Vehicle Type | Car or Motorcycle"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <input
                      value={vehicle.colour}
                      onChange={(e) => handleVehicleChange(index, e)}
                      type="text"
                      name="colour"
                      placeholder="Colour"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />

                    <input
                      value={vehicle.make}
                      onChange={(e) => handleVehicleChange(index, e)}
                      type="text"
                      name="make"
                      placeholder="Vehicle Make"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <input
                      value={vehicle.model}
                      onChange={(e) => handleVehicleChange(index, e)}
                      type="text"
                      name="model"
                      placeholder="Vehicle Model Name"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <input
                      value={vehicle.year}
                      onChange={(e) => handleVehicleChange(index, e)}
                      type="text"
                      name="year"
                      placeholder="Vehicle Year"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <input
                      value={vehicle.stickerNumber}
                      onChange={(e) => handleVehicleChange(index, e)}
                      type="text"
                      name="stickerNumber"
                      placeholder="Sticker Number"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <input
                      value={vehicle.registrationNumber}
                      onChange={(e) => handleVehicleChange(index, e)}
                      type="text"
                      name="registrationNumber"
                      placeholder="Vehicle Registration Number"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <label
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      {vehicle.paperDocument
                        ? vehicle.paperDocument.name
                        : "Upload Document"}
                      <input
                        type="file"
                        name="nocFile"
                        accept="image/*"
                        onChange={(event) =>
                          handlePaperDocumentUpload(event, index)
                        }
                        hidden
                      />
                    </label>
                  </div>
                </div>
              </>
            ))}
            <div className="text-center mt-3">
              <button
                type="button"
                onClick={addVehicleField}
                className="btn btn-outline-primary w-25 m-5 mt-2"
              >
                <FaPlus /> Vehicles
              </button>
            </div>
          </div>
        )}

        {/* tanent details */}
        {showTanent && (
          <div className="row text-center">
            <hr />
            <h1 className="my-3 fw-bold ">Enter Tanent Details</h1>
            {tanents.map((tanent, index) => (
              <>
                <div className="col-md-6">
                  <div key={index}>
                    <input
                      value={tanent.name}
                      onChange={(e) => handleTanentChange(index, "name", e)}
                      type="text"
                      name="name"
                      placeholder="Tanent Name"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <input
                      value={tanent.cnic}
                      onChange={(e) => handleTanentChange(index, "cnic", e)}
                      type="text"
                      name="cnic"
                      placeholder="CNIC"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <input
                      value={tanent.occupation}
                      onChange={(e) =>
                        handleTanentChange(index, "occupation", e)
                      }
                      type="text"
                      name="occupation"
                      placeholder="Occupation"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <input
                      value={tanent.number}
                      onChange={(e) => handleTanentChange(index, "number", e)}
                      type="tel"
                      name="number"
                      placeholder="Phone No"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <br />
                    <label htmlFor="date">Date Of Birth</label>
                    <br />
                    <input
                      value={tanent.dob}
                      onChange={(e) => handleTanentChange(index, "dob", e)}
                      type="date"
                      name="dob"
                      placeholder="Date Of Birth"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <br />
                  <div>
                    <label htmlFor="nocIssue">Date Of NOC Issuance</label>
                    <br />
                    <input
                      value={tanent.NOCIssue}
                      onChange={(e) => handleTanentChange(index, "nocIssue", e)}
                      type="date"
                      name="nocIssue"
                      id="nocIssue"
                      placeholder="NOC Issueance Date"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />{" "}
                    <br />
                    <input
                      value={tanent.nocNo}
                      onChange={(e) => handleTanentChange(index, "nocNo", e)}
                      type="text"
                      name="nocNo"
                      id="nocno"
                      placeholder="NOC Number"
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    />
                    <label
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      {tanent.photoUrl ? tanent.photoUrl.name : "Upload Photo"}
                      <input
                        type="file"
                        name="nocFile"
                        accept="image/*"
                        onChange={(event) =>
                          handleTanentPhotoUpload(index, event)
                        }
                        hidden
                      />
                    </label>
                    <label
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      {tanent.cnicUrl ? tanent.cnicUrl.name : "Upload CNIC"}
                      <input
                        type="file"
                        name="cnicFile"
                        accept="image/* "
                        onChange={(event) =>
                          handleTanentCnicUpload(index, event)
                        }
                        hidden
                      />
                    </label>
                    <label
                      className="w-75 my-3 text-white py-2"
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid white",
                        borderRadius: "12px",
                        textIndent: "12px",
                        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      }}
                    >
                      {tanent.nocUrl ? tanent.nocUrl.name : "Upload NOC"}
                      <input
                        type="file"
                        name="nocFile"
                        accept="image/* "
                        onChange={(event) =>
                          handleTanentNocUpload(index, event)
                        }
                        hidden
                      />
                    </label>
                  </div>
                </div>
              </>
            ))}
            <div>
              <button
                type="button"
                onClick={addTanentField}
                className="btn btn-outline-primary w-25 m-5 mt-2"
              >
                <FaPlus /> Tanents
              </button>
            </div>
          </div>
        )}

        <div className="row text-center justify-content-center pt-2 ">
          {loader ? (
            <div className="text-center d-flex align-items-center my-3 justify-content-center">
              <Audio
                height="80"
                width="80"
                radius="9"
                color="rgba(255, 255, 255, 0.2)"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
              />
            </div>
          ) : (
            <></>
          )}
          <button
            type="submit"
            className="btn w-75 mt-1 fw-bold"
            style={{ borderRadius: "12px", backgroundColor: "#03bb50" }}
          >
            SUBMIT
          </button>
        </div>
      </form>
    </main>
  );
};

export default ResidentForm;
