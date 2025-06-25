function loadTreeFromLocalStorage() {
    const treeData = JSON.parse(localStorage.getItem("familyTree")) || [];
    return treeData;
}

function renderTree(treeData) {
    const container = document.getElementById("treeDisplay");
    container.innerHTML = "";

    treeData.forEach(member => {
        const memberDiv = document.createElement("div");
        memberDiv.className = "member";
        memberDiv.innerHTML = `
            <h3>${member.name}</h3>
            <p>${member.years}</p>
        `;
        container.appendChild(memberDiv);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const treeData = loadTreeFromLocalStorage();
    renderTree(treeData);
});
