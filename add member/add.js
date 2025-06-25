const apiUrl = 'http://localhost:3000/members';

const familyTreeDiv = document.getElementById('familyTree');
const addFamilyBtn = document.getElementById('addFamilyBtn');
const myTreeBtn = document.getElementById('myTreeBtn');
const familyModal = document.getElementById('familyModal');
const closeModalBtn = familyModal.querySelector('.close');
const familyForm = document.getElementById('familyForm');

const memberIdInput = document.getElementById('memberId');
const nameInput = document.getElementById('name');
const birthYearInput = document.getElementById('birthYear');
const deathYearInput = document.getElementById('deathYear');
const parentIdSelect = document.getElementById('parentId');
const generationSelect = document.getElementById('generation');
const isHighlightedSelect = document.getElementById('isHighlighted');

let members = [];

function fetchMembers() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      members = data;
      renderFamilyTree(members);
      populateParentOptions(members);
    })
    .catch(() => alert('Failed to fetch members'));
}

function renderFamilyTree(members) {
  familyTreeDiv.innerHTML = '';

  if (members.length === 0) {
    familyTreeDiv.innerHTML = '<p>No family members added yet.</p>';
    return;
  }

  //ფილტრავს ყველა მემბერს, მხოლოდ იმ წევრებს ვისაც არ ყავს მშობელი
  const rootMembers = members.filter(m => !m.parentId);
  const treeHTML = generateTreeHTML(rootMembers);
  familyTreeDiv.innerHTML = `<div class="tree"><ul>${treeHTML}</ul></div>`;

  // მიაბი Edit/Delete event listener-ები
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      openEditModal(id);
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this member?')) {
        deleteMember(id);
      }
    });
  });
}


//აგენერირებს tree html-ს
function generateTreeHTML(memberList) {
  return memberList.map(member => {
    const children = members.filter(m => m.parentId === member._id);
    return `
      <li>
        <div class="tree-member ${member.isHighlighted ? 'highlight' : ''}">
          ${member.name}<br>
          <small>${member.birthYear} - ${member.deathYear || 'Alive'}</small>
          <div class="action-buttons">
            <button class="edit-btn" data-id="${member._id}">Edit</button>
            <button class="delete-btn" data-id="${member._id}">Delete</button>
          </div>
        </div>
        ${children.length > 0 ? `<ul>${generateTreeHTML(children)}</ul>` : ''}
      </li>
    `;
  }).join('');
}

function populateParentOptions(members) {
  parentIdSelect.innerHTML = '<option value="">None (Top Level)</option>';
  members.forEach(m => {
    parentIdSelect.innerHTML += `<option value="${m._id}">${m.name}</option>`;
  });
}

function openAddModal() {
  familyForm.reset();
  memberIdInput.value = '';
  parentIdSelect.value = '';
  generationSelect.value = '3';
  isHighlightedSelect.value = 'false';
  document.getElementById('modalTitle').textContent = 'Add Family Member';
  showModal();
}

function openEditModal(id) {
  const member = members.find(m => m._id === id);
  if (!member) return alert('Member not found');

  memberIdInput.value = member._id;
  nameInput.value = member.name;
  birthYearInput.value = member.birthYear;
  deathYearInput.value = member.deathYear || '';
  parentIdSelect.value = member.parentId || '';
  generationSelect.value = member.generation;
  isHighlightedSelect.value = member.isHighlighted ? 'true' : 'false';

  document.getElementById('modalTitle').textContent = 'Edit Family Member';
  showModal();
}

function showModal() {
  familyModal.classList.add('show');
}

function hideModal() {
  familyModal.classList.remove('show');
}

function saveMember(e) {
  e.preventDefault();

  const id = memberIdInput.value;
  const memberData = {
    name: nameInput.value.trim(),
    birthYear: parseInt(birthYearInput.value),
    deathYear: deathYearInput.value ? parseInt(deathYearInput.value) : undefined,
    parentId: parentIdSelect.value || null,
    generation: parseInt(generationSelect.value),
    isHighlighted: isHighlightedSelect.value === 'true'
  };

  if (!memberData.name || !memberData.birthYear || !memberData.generation) {
    return alert('Please fill required fields');
  }

  const requestOptions = {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData)
  };

  const url = id ? `${apiUrl}/${id}` : apiUrl;

  //შეინახავს და გაანახლებს
  fetch(url, requestOptions)
    .then(res => {
      if (!res.ok) throw new Error(id ? 'Update failed' : 'Save failed');
      return res.json();
    })
    .then(() => {
      fetchMembers();
      hideModal();
    })
    .catch(() => alert(id ? 'Failed to update member' : 'Failed to save member'));
}

//შლის და ანახლებს
function deleteMember(id) {
  fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
    .then(res => {
      if (!res.ok) throw new Error('Delete failed');
      return res.json();
    })
    .then(() => fetchMembers())
    .catch(() => alert('Failed to delete member'));
}

addFamilyBtn.addEventListener('click', openAddModal);
closeModalBtn.addEventListener('click', hideModal);
window.addEventListener('click', e => {
  if (e.target === familyModal) hideModal();
});
familyForm.addEventListener('submit', saveMember);


//ცვლის 
function showModal() {
  familyModal.classList.remove('hidden');
  familyModal.style.display = 'block';
}

function hideModal() {
  familyModal.classList.add('hidden');
  familyModal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  addFamilyBtn = document.getElementById('addFamilyBtn');
  closeModalBtn = document.querySelector('.close');
  familyModal = document.getElementById('familyModal');
  
  addFamilyBtn.addEventListener('click', openAddModal);
  closeModalBtn.addEventListener('click', hideModal);
  window.addEventListener('click', function(e) {
    if (e.target === familyModal) hideModal();
  });
  familyForm.addEventListener('submit', saveMember);
  
  fetchMembers();
});

fetchMembers();

