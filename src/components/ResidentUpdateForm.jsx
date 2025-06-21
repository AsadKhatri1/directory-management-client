import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Audio } from "react-loader-spinner";

const ResidentUpdateForm = () => {
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
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchResidentData = async () => {
      try {
        const response = await axios.get(
          `${backendURL}/api/v1/resident/getResident/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const resident = response.data.resident;
        setFullName(resident.FullName || "");
        setEmail(resident.Email || "");
        setPhone(resident.Phone || "");
        setHouseNumber(resident.HouseNumber || "");
        setProfession(resident.Profession || "");
        setOfficeTel(resident.officeTel || "");
        setQualification(resident.Qualification || "");
        setBAddress(resident.bAddress || "");
        setNOCHolder(resident.NOCHolder || "");
        setNOCIssue(resident.NOCIssue || "");
        setNOCNo(resident.NOCNo || "");
        setDOB(resident.DOB ? resident.DOB.split("T")[0] : "");
        setCNIC(resident.CNIC || "");
        setPhoto(resident.Photo || "");
        setCnicFile(resident.CnicFile || "");
        setNocFile(resident.NocFile || "");
      } catch (error) {
        toast.error("Failed to load resident data");
      }
    };
    fetchResidentData();
  }, [id]);

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

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      let photoUrl = Photo;
      if (Photo && typeof Photo !== "string") {
        photoUrl = await uploadFileToCloudinary(Photo);
      }

      let cnicUrl = cnicFile;
      if (cnicFile && typeof cnicFile !== "string") {
        cnicUrl = await uploadFileToCloudinary(cnicFile);
      }

      let nocUrl = nocFile;
      if (nocFile && typeof nocFile !== "string") {
        nocUrl = await uploadFileToCloudinary(nocFile);
      }

      const response = await axios.put(
        `${backendURL}/api/v1/resident/updateResidentData/${id}`,
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
          Photo: photoUrl,
          CnicFile: cnicUrl,
          NocFile: nocUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Resident updated successfully");
        navigate("/dashboard/residents");
      }
    } catch (err) {
      toast.error(err?.response?.data.message || "Update failed");
      setLoader(false);
    }
  };

  return (
    <main className="main-container text-center mt-5">
      <h1 className="my-3 fw-bold">Update Resident Details</h1>

      <form action="put" className="w-100 mt-3" onSubmit={submitHandler}>
        <div className="row">
          <div className="col-md-6">
            <div className="w-75 my-3">
              <label
                htmlFor="photo"
                className=" d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                {Photo
                  ? typeof Photo === "string"
                    ? "Current Photo"
                    : Photo.name
                  : "Upload new image"}
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="cnicFile"
                className="d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                {cnicFile
                  ? typeof cnicFile === "string"
                    ? "Current CNIC"
                    : cnicFile.name
                  : "Upload new CNIC"}
              </label>
              <input
                type="file"
                id="cnicFile"
                name="cnicFile"
                accept="image/*, .pdf"
                onChange={(e) => setCnicFile(e.target.files[0])}
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="nocFile"
                className=" d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                {nocFile
                  ? typeof nocFile === "string"
                    ? "Current NOC"
                    : nocFile.name
                  : "Upload new NOC"}
              </label>
              <input
                type="file"
                id="nocFile"
                name="nocFile"
                accept="image/*, .pdf"
                onChange={(e) => setNocFile(e.target.files[0])}
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="FullName"
                className=" d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                Full Name
              </label>
              <input
                value={FullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                id="FullName"
                name="FullName"
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="Email"
                className="d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                Email
              </label>
              <input
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="Email"
                name="Email"
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="Profession"
                className=" d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                Profession
              </label>
              <input
                value={Profession}
                onChange={(e) => setProfession(e.target.value)}
                type="text"
                id="Profession"
                name="Profession"
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="Qualification"
                className="d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                Qualification
              </label>
              <input
                value={Qualification}
                onChange={(e) => setQualification(e.target.value)}
                type="text"
                id="Qualification"
                name="Qualification"
                className="w-100 text-white py-2"
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
            <div className="w-75 my-3">
              <label
                htmlFor="Phone"
                className=" d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                Phone Number
              </label>
              <input
                value={Phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                id="Phone"
                name="Phone"
                minLength="11"
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="HouseNumber"
                className="d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                House Number
              </label>
              <input
                value={HouseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                type="text"
                id="HouseNumber"
                name="HouseNumber"
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="CNIC"
                className=" d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                CNIC
              </label>
              <input
                value={CNIC}
                onChange={(e) => setCNIC(e.target.value)}
                type="text"
                id="CNIC"
                name="CNIC"
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="date"
                className=" d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                Date Of Birth
              </label>
              <input
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
                type="date"
                id="date"
                name="date"
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="officeTel"
                className="d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                Tel (office)
              </label>
              <input
                value={officeTel}
                onChange={(e) => setOfficeTel(e.target.value)}
                type="tel"
                id="officeTel"
                name="officeTel"
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="businessAddress"
                className="d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                Business/Office Address
              </label>
              <textarea
                value={bAddress}
                onChange={(e) => setBAddress(e.target.value)}
                id="businessAddress"
                name="business address"
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="nocHolder"
                className="d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                NOC Holders Name
              </label>
              <input
                value={NOCHolder}
                onChange={(e) => setNOCHolder(e.target.value)}
                type="text"
                id="nocHolder"
                name="noc"
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="nocIssue"
                className="d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                Date Of NOC Issuance
              </label>
              <input
                value={NOCIssue}
                onChange={(e) => setNOCIssue(e.target.value)}
                type="date"
                id="nocIssue"
                name="nocIssue"
                className="w-100 text-white py-2"
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

            <div className="w-75 my-3">
              <label
                htmlFor="nocNo"
                className=" d-block text-left mb-1"
                style={{ textAlign: "left" }}
              >
                NOC Number
              </label>
              <input
                value={NOCNo}
                onChange={(e) => setNOCNo(e.target.value)}
                type="text"
                id="nocNo"
                name="nocno"
                className="w-100 text-white py-2"
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
        </div>

        <div className="row text-center justify-content-center pt-2">
          {loader ? (
            <div className="text-center d-flex align-items-center my-3 justify-content-center">
              <Audio
                height="80"
                width="80"
                radius="9"
                color="rgba(255, 255, 255, 0.2)"
                ariaLabel="loading"
              />
            </div>
          ) : (
            <button
              type="submit"
              className="btn w-75 mt-1 fw-bold"
              style={{ borderRadius: "12px", backgroundColor: "#03bb50" }}
            >
              UPDATE
            </button>
          )}
        </div>
      </form>
    </main>
  );
};

export default ResidentUpdateForm;
