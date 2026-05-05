import { supabase } from "./supabase.js";

let currentUser = null;

// ================= AUTH =================

// SIGNUP
async function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
        alert(error.message);
    } else {
        alert("Signup successful");
    }
}

// LOGIN
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message);
    } else {
        currentUser = data.user;
        alert("Login successful");
        loadFiles();
    }
}

// LOGOUT
async function logout() {
    await supabase.auth.signOut();
    currentUser = null;
    alert("Logged out");
}

// ================= UPLOAD =================

async function uploadFile() {

    const file = document.getElementById("fileInput").files[0];

    if (!file) {
        alert("Select file");
        return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
        alert("Login first");
        return;
    }

    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

    if (error) {
        console.error(error);
        alert("Upload failed");
        return;
    }

    // Save metadata in DB
    await supabase.from("files").insert({
        user_id: user.id,
        filename: filePath
    });

    alert("File uploaded");
    loadFiles();
}

// ================= LOAD FILES =================
console.log("CURRENT USER:", currentUser);
async function loadFiles() {

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return;

    const { data, error } = await supabase.storage
    .from("uploads")
    .list(user.id);

    console.log("FILES DATA:", data);
    console.log("ERROR:", error);

    const fileList = document.getElementById("fileList");
    fileList.innerHTML = "";

    if (error) {
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        fileList.innerHTML = "No files found";
        return;
    }

    data.forEach(file => {
    const filePath = `${currentUser.id}/${file.name}`;

    const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

        const link = document.createElement("a");
        link.href = urlData.publicUrl;
       link.innerText = file.name; // clean name
        link.target = "_blank";

        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";

        delBtn.onclick = async () => {
            await supabase.storage
                .from("uploads")
                .remove([`${user.id}/${file.name}`]);

            await supabase
                .from("files")
                .delete()
                .eq("id", file.id);

            loadFiles();
        };

        const div = document.createElement("div");
        div.appendChild(link);
        div.appendChild(delBtn);

        fileList.appendChild(div);
    });
}

// ================= INIT =================

document.addEventListener("DOMContentLoaded", async () => {

    const { data } = await supabase.auth.getUser();
    currentUser = data.user;

    

    document.getElementById("signupBtn").onclick = signUp;
    document.getElementById("loginBtn").onclick = login;
    document.getElementById("logoutBtn").onclick = logout;

    document.getElementById("uploadBtn").onclick = uploadFile;

    loadFiles();
});