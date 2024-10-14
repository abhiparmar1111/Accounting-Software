var modal = document.getElementById("addUserModal");
var editmodal = document.getElementById("editUserModal");
var btn = document.getElementById("addUserBtn");
var span = document.getElementsByClassName("close")[0];
var editspan = document.getElementById("closeEditModal");
var valueEl = document.getElementById("filter-value");

btn.onclick = function () {
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
}

editspan.onclick = function () {
  editmodal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == editmodal) {
    editmodal.style.display = "none";
  }
}

function customFilter(data, filterParams) {
  var searchTerm = filterParams.term.toLowerCase();
  return data.fullname.toLowerCase().includes(searchTerm) ||
    data.username.toLowerCase().includes(searchTerm);
}

function updateFilter() {
  var value = valueEl.value;
  if (value) {
    table.setFilter(customFilter, { term: value });
  } else {
    table.clearFilter();
  }
}

document.getElementById("filter-value").addEventListener("keyup", updateFilter);

document.getElementById("filter-clear").addEventListener("click", function () {
  valueEl.value = "";
  table.clearFilter();
});

document.getElementById("addUserForm").onsubmit = function (event) {
  event.preventDefault();

  var formData = new FormData(event.target);
  var password = formData.get("password");
  var confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  fetch('/add_user', {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(data => {
      alert(data);
      location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
    });

  modal.style.display = "none";
}

var table = new Tabulator("#example-table", {
  maxHeight: "100%",
  layout: "fitColumns",
  columns: [
    { title: "Full Name", field: "fullname" },
    { title: "Username", field: "username" },
    { title: "Email", field: "email" },
    { title: "Mobile", field: "mobile" },
    {
      title: "Action", field: "action", width: 150, hozAlign: "center", formatter: function (cell, formatterParams, onRendered) {
        var editbutton = document.createElement("button");
        editbutton.classList.add("btn", "btn-sm", "btn-primary");
        editbutton.innerHTML = "Edit";
        editbutton.addEventListener("click", function () {
          openEditmodal(cell.getRow().getData());
        });
        var deletebutton = document.createElement("button");
        deletebutton.classList.add("btn", "btn-sm", "btn-danger");
        deletebutton.innerHTML = "Delete";
        deletebutton.style.marginLeft = "10px";
        deletebutton.addEventListener("click", function () {
          if (confirm("Are you sure you want to delete this user?")) {
            deleteUser(cell.getRow().getData());
          }
        });
        var container = document.createElement("div");
        container.appendChild(editbutton);
        container.appendChild(deletebutton);
        cell.getElement().appendChild(container);
        return container;
      }
    }
  ],
});

function fetchUsers() {
  fetch('/users')
    .then(response => response.json())
    .then(users => {
      table.setData(users);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded and parsed');
  fetchUsers();
});

function openEditmodal(userdata) {
  document.getElementById("edituserid").value = userdata.user_id;
  document.getElementById("editfullname").value = userdata.fullname;
  document.getElementById("editusername").value = userdata.username;
  document.getElementById("editemail").value = userdata.email;
  document.getElementById("editmobile").value = userdata.mobile;

  editmodal.style.display = "block";
}

document.getElementById("editUserForm").onsubmit = function (event) {
  event.preventDefault();

  var formData = new FormData(document.getElementById("editUserForm"));
  var userdata = {
    id: formData.get('id'),
    fullname: formData.get('fullname'),
    username: formData.get('username'),
    email: formData.get('email'),
    mobile: formData.get('mobile')
  };
  fetch(`/edit_user/${userdata.id}`, {
    method: 'POST',
    body: new URLSearchParams(formData)
  })
    .then(response => response.text())
    .then(data => {
      alert(data);
      location.reload();
      fetchUsers();
    })
    .catch(error => {
      alert("Error adding user: " + error);
      console.error("Error:", error);
    });
  editmodal.style.display = "none";
}

function deleteUser(userdata) {
  fetch(`/delete_user/${userdata.user_id}`, {
    method: 'DELETE'
  })
    .then(response => response.text())
    .then(data => {
      alert(data);
      location.reload();
      fetchUsers();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
