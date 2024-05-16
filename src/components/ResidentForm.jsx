import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { Audio } from "react-loader-spinner";
// Configure Cloudinary with your credentials

const ResidentForm = () => {
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
    },
  ]);

  const [maids, setMaids] = useState([
    { name: "", dob: "", address: "", guardian: "", number: "", cnic: "" },
  ]);

  const handleMaidChange = (index, name, event) => {
    const { value } = event.target;
    const updatedMaids = [...maids];
    updatedMaids[index][name] = value;
    setMaids(updatedMaids);
  };

  const addMaidField = () => {
    setMaids([
      ...maids,
      { name: "", dob: "", address: "", guardian: "", number: "", cnic: "" },
    ]);
  };
  // const [RelativeName, setRelativeName] = useState(""); // New state for relative name
  const [relatives, setRelatives] = useState([
    { name: "", relation: "", dob: "", occupation: "", cnic: "", number: "" },
  ]); // Array to hold relative information
  const navigate = useNavigate();

  //--------------------- function for submitting form ----------------------

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      // uploading image
      const formData = new FormData();
      formData.append("file", Photo);
      formData.append("upload_preset", "images_preset");
      // Upload photo to Cloudinary
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      let photoUrl;
      if (cloudinaryResponse.ok) {
        const cloudinaryData = await cloudinaryResponse.json();
        photoUrl = cloudinaryData.secure_url; // Extract the photo URL from the Cloudinary response
      }

      // Upload CNIC

      formData.set("file", cnicFile);
      // formData.append('upload_preset', 'images_preset');
      formData.set("Content-Type", cnicFile.type);

      const cnicResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      let cnicUrl;
      if (cnicResponse.ok) {
        const cnicData = await cnicResponse.json();
        cnicUrl = cnicData.secure_url;
      } else {
        throw new Error("Failed to upload CNIC");
      }

      // Upload NOC

      formData.set("file", nocFile);
      formData.set("Content-Type", nocFile.type);
      const nocResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      let nocUrl;
      if (nocResponse.ok) {
        const nocData = await nocResponse.json();
        nocUrl = nocData.secure_url;
      } else {
        throw new Error("Failed to upload NOC");
      }

      // Upload Cant Pass

      formData.set("file", cantPass);
      formData.set("Content-Type", cantPass.type);
      const cantResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      let cantUrl;
      if (cantResponse.ok) {
        const cantData = await cantResponse.json();
        cantUrl = cantData.secure_url;
      } else {
        throw new Error("Failed to upload Cant Pass");
      }

      // Upload Police v

      formData.set("file", policeV);
      formData.set("Content-Type", policeV.type);
      const polResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      let polUrl;
      if (polResponse.ok) {
        const polData = await polResponse.json();
        polUrl = polData.secure_url;
      } else {
        throw new Error("Failed to upload Cant Pass");
      }

      // Upload Lisence

      formData.set("file", lisence);
      formData.set("Content-Type", lisence.type);
      const lResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dgfwpnjkw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      let lUrl;
      if (lResponse.ok) {
        const lData = await lResponse.json();
        lUrl = lData.secure_url;
      } else {
        throw new Error("Failed to upload Cant Pass");
      }

      const response = await axios.post(
        "https://directory-management.onrender.com/api/v1/resident/add",
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
          maids,
          Photo: photoUrl,
          CnicFile: cnicUrl,
          NocFile: nocUrl,
          CantFile: cantUrl,
          VerificationFile: polUrl,
          LisenceFile: lUrl,
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
      },
    ]);
  };

  const handleRelativeChange = (index, name, event) => {
    const { value } = event.target;
    const updatedRelatives = [...relatives];
    updatedRelatives[index][name] = value;
    setRelatives(updatedRelatives);
  };
  const addRelativeField = () => {
    setRelatives([
      ...relatives,
      { name: "", relation: "", dob: "", occupation: "", cnic: "", number: "" },
    ]);
  };

  return (
    <main className="main-container text-center mt-5">
      <h1>Add A New Resident</h1>

      <form action="post" className="w-100 mt-3" onSubmit={submitHandler}>
        <div className="row text-center justify-content-center pt-2 ">
          <div className="col-md-6">
            {/* <div className="mb-5 w-75"> */}
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
              {cnicFile ? cnicFile.name : "Upload CNIC image"}
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
              {nocFile ? nocFile.name : "Upload NOC image"}
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
                accept="image/*, .pdf"
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
                accept="image/*, .pdf"
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
            <br />
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
            />{" "}
            <br />
            <div className="mt-3">
              <span className="blockquote-footer my-3 fw-bold fs-6">
                Enter Family Members
              </span>

              {/* Relative Fields */}
              {relatives.map((relative, index) => (
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
                    onChange={(e) => handleRelativeChange(index, "relation", e)}
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
                </div>
              ))}
              <button
                type="button"
                onClick={addRelativeField}
                className="btn btn-outline-primary m-5 mt-2"
              >
                <FaPlus /> Members
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="text-center my-3">
              <span className="blockquote-footer my-3 fw-bold fs-6">
                Enter servant details
              </span>
              {maids.map((maid, index) => (
                <div key={index}>
                  <input
                    value={maid.name}
                    onChange={(e) => handleMaidChange(index, "name", e)}
                    type="text"
                    name="name"
                    className="w-75 my-3 text-white py-2"
                    placeholder="Maid's Name"
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
                    placeholder="CNIC"
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
              ))}
              <button
                type="button"
                onClick={addMaidField}
                className="btn btn-outline-primary m-5 mt-2"
              >
                <FaPlus /> Servants
              </button>
            </div>
            <div className="text-center mt-3">
              <span className="blockquote-footer my-3 fw-bold fs-6">
                Enter vehicle details
              </span>
              {/* Vehicle Fields */}
              {vehicles.map((vehicle, index) => (
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
                </div>
              ))}
              <button
                type="button"
                onClick={addVehicleField}
                className="btn btn-outline-primary m-5 mt-2"
              >
                <FaPlus /> Vehicles
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-success w-75 mt-1"
            style={{ borderRadius: "12px" }}
          >
            SUBMIT
          </button>

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
        </div>
      </form>
    </main>
  );
};

export default ResidentForm;
