import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaShareAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaHome,
  FaUser,
  FaUtensils,
  FaUsers,
  FaChild,
  FaIdCard,
  FaBuilding,
  FaVenusMars,
  FaCalendarAlt,
  FaCheckCircle,
  FaWhatsapp,
  FaUserPlus,
  FaBus, // Added for address/travel context
  FaTag
} from "react-icons/fa";

// --- New Reusable Stat/Action Card Component ---
const StatCard = ({ icon: Icon, label, value, iconBgColor = "bg-indigo-100", iconColor = "text-indigo-600", borderClass = "border-gray-100" }) => (
  <div className="p-5 rounded-xl border border-gray-200 shadow-md transition duration-300 hover:shadow-lg bg-white">
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <div className="text-sm font-medium uppercase tracking-wide text-gray-500 mb-1">{label}</div>
        <div className="text-2xl font-bold text-gray-800">{value || "N/A"}</div>
      </div>
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${iconBgColor} flex-shrink-0`}>
        <Icon className={`text-xl ${iconColor}`} />
      </div>
    </div>
  </div>
);

// --- New Detail Item for Contact/Address (more minimalist) ---
const ContactDetailItem = ({ icon: Icon, label, value, onClick, buttonText, iconColor = 'text-indigo-600' }) => (
  <div className="flex items-center p-4 border-b border-gray-100 last:border-b-0">
    <Icon className={`text-xl mr-4 flex-shrink-0 ${iconColor}`} />
    <div className="flex-1">
      <div className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</div>
      <div className="font-medium text-gray-700 break-words">{value || "N/A"}</div>
    </div>
    {onClick && buttonText && value && (
      <button
        onClick={onClick}
        className="ml-4 px-3 py-1 bg-indigo-500 text-white rounded-lg font-medium text-sm hover:bg-indigo-600 transition-colors flex-shrink-0"
      >
        {buttonText}
      </button>
    )}
  </div>
);


// --- The Main Component ---
const UserDetail = () => {
  const { Member_ID } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // --- Data Fetching Logic (Kept the same) ---
  useEffect(() => {
    const loadMember = async () => {
      try {
        const response = await axios.get(
          `https://api.regeve.in/api/event-forms/${Member_ID}`
        );
        setMember(response.data?.data);
      } catch (err) {
        console.error("Error fetching member data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [Member_ID]);

  const totalMembers = (member?.Adult_Count || 0) + (member?.Children_Count || 0);

  // --- Handler Functions (Kept the same) ---
  const handleShare = () => {
    if (!member) return;
    const profileURL = window.location.href;
    const shareMessage = `View Member Profile for ${member.Name} (ID: ${Member_ID}).\n\nProfile Link:\n${profileURL}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const handleWhatsApp = (whatsappNumber) => {
    if (whatsappNumber) {
      const formattedNumber = whatsappNumber.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${formattedNumber}`, '_blank');
    }
  };

  const handleEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    }
  };

  // --- LOADING STATE (Kept functional) ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-300 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full absolute top-0 left-0 animate-spin"></div>
          </div>
          <p className="mt-4 text-indigo-600 font-medium">Loading Member Profile...</p>
        </div>
      </div>
    );
  }

  // --- NOT FOUND STATE (Kept functional) ---
  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border border-gray-200">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUser className="text-3xl text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Member Not Found</h3>
          <p className="text-gray-600 mb-6">The requested member profile could not be loaded.</p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN DETAIL VIEW (NEW DESIGN) ---
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER SECTION: Name, Image, & Primary Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            
            {/* Image & ID */}
            <div className="flex flex-col items-center">
                {member.Photo?.url && !imageError ? (
                <img
                    src={`https://api.regeve.in${member.Photo.url}`}
                    alt="Profile"
                    className="w-28 h-28 object-cover rounded-full border-4 border-indigo-100 shadow-lg"
                    onError={() => setImageError(true)}
                />
                ) : (
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-4 border-indigo-100 shadow-lg">
                    <FaUser className="text-4xl text-gray-500" />
                </div>
                )}
                <span className="mt-3 px-4 py-1 bg-indigo-500 text-white rounded-full text-xs font-bold tracking-wider">
                    ID: {Member_ID}
                </span>
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-1">{member.Name}</h1>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <span className="text-base text-gray-600 flex items-center gap-2">
                  <FaBuilding className="text-indigo-500" />
                  Company: **{member.Company_ID || 'N/A'}**
                </span>
                <span className="text-base text-gray-600 flex items-center gap-2">
                  <FaTag className="text-indigo-500" />
                  Status: <span className="font-semibold text-green-600">Registered</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg"
              >
                <FaShareAlt />
                <span>Share Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* STATS & DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* COLUMN 1: Guest Counts & Personal Info (Stats Focused) */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Quick Guest Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-3 border-gray-100">
                    <FaUsers className="mr-3 text-indigo-600" />
                    Guest & Food Overview
                </h2>
                <div className="space-y-4">
                    <StatCard
                        icon={FaUserPlus}
                        label="Total Party"
                        value={totalMembers}
                        iconBgColor="bg-indigo-100"
                        iconColor="text-indigo-600"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            icon={FaUsers}
                            label="Adults"
                            value={member.Adult_Count || 0}
                            iconBgColor="bg-teal-100"
                            iconColor="text-teal-600"
                        />
                        <StatCard
                            icon={FaChild}
                            label="Children"
                            value={member.Children_Count || 0}
                            iconBgColor="bg-teal-100"
                            iconColor="text-teal-600"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            icon={FaUtensils}
                            label="Veg"
                            value={member.Veg_Count || 0}
                            iconBgColor="bg-green-100"
                            iconColor="text-green-600"
                        />
                        <StatCard
                            icon={FaUtensils}
                            label="Non-Veg"
                            value={member.Non_Veg_Count || 0}
                            iconBgColor="bg-red-100"
                            iconColor="text-red-600"
                        />
                    </div>
                </div>
            </div>

            {/* Personal Info Block */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center border-b pb-3 border-gray-100">
                    <FaUser className="mr-3 text-indigo-600" />
                    Personal Info
                </h2>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-gray-700">
                        <span className="flex items-center gap-2 text-gray-500"><FaCalendarAlt /> Age:</span>
                        <span className="font-medium text-gray-800">{member.Age || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                        <span className="flex items-center gap-2 text-gray-500"><FaVenusMars /> Gender:</span>
                        <span className="font-medium text-gray-800">{member.Gender || 'N/A'}</span>
                    </div>
                </div>
            </div>
          </div>

          {/* COLUMN 2 & 3: Contact & Address (Detail Focused) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-light text-gray-800 mb-6 border-b pb-3 border-gray-100">
              <FaPhoneAlt className="inline mr-3 text-2xl text-indigo-600" />
              Primary Contact Information
            </h2>

            {/* Contact Details List */}
            <div className="divide-y divide-gray-100">
              <ContactDetailItem
                icon={FaPhoneAlt}
                label="Phone Number"
                value={member.Phone_Number}
                onClick={() => handleCall(member.Phone_Number)}
                buttonText="Call"
                iconColor="text-indigo-600"
              />
              <ContactDetailItem
                icon={FaWhatsapp}
                label="WhatsApp Number"
                value={member.WhatsApp_Number}
                onClick={() => handleWhatsApp(member.WhatsApp_Number)}
                buttonText="WhatsApp"
                iconColor="text-green-600"
              />
              <ContactDetailItem
                icon={FaEnvelope}
                label="Email Address"
                value={member.Email}
                onClick={() => handleEmail(member.Email)}
                buttonText="Email"
                iconColor="text-indigo-600"
              />
              <ContactDetailItem
                icon={FaHome}
                label="Address"
                value={member.Address}
                iconColor="text-indigo-600"
              />
            </div>
            
            {/* Map/Travel Placeholder */}
            <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FaBus className="mr-3 text-indigo-600" />
                    Travel Notes
                </h3>
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-700 text-sm">
                    <p>Transportation details or location map can be integrated here using an iFrame or specific travel fields from the member object.</p>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;