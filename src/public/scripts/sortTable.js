var TableLastSortedColumn = -1;

function SortTable() {
  var sortColumn = parseInt(arguments[0]);
  var type = arguments.length > 1 ? arguments[1] : 'T';
  var TableIDvalue = arguments[2];
  var table = document.getElementById(TableIDvalue);
  var tbody = table.getElementsByTagName("tbody")[0];
  var rows = tbody.getElementsByTagName("tr");
  var arrayOfRows = new Array();

  for (var i = 0, len = rows.length; i < len; i++) {
    arrayOfRows[i] = new Object;
    arrayOfRows[i].oldIndex = i;
    var celltext = rows[i].getElementsByTagName("td")[sortColumn].innerHTML.replace(/<[^>]*>/g, "");
    var re = type == "N" ? /[^\.\-\+\d]/g : /[^a-zA-Z0-9]/g;
    arrayOfRows[i].value = celltext.replace(re, "").substr(0, 25).toLowerCase();
  }

  if (sortColumn == TableLastSortedColumn) {
    arrayOfRows.reverse();
  }
  else {

    //reset fleche ancienne colonne 
    if (TableLastSortedColumn != -1)
      table.getElementsByTagName('th')[TableLastSortedColumn].firstElementChild.innerHTML = 'unfold_more';

    TableLastSortedColumn = sortColumn;
    switch (type) {
      case "N": arrayOfRows.sort(CompareRowOfNumbers); break;
      case "S": arrayOfRows.sort(CompareRowOfStates); break;
      case "P": arrayOfRows.sort(CompareRowOfPrios); break;
      default: arrayOfRows.sort(CompareRowOfText);
    }
  }

  //inversion fleche
  let icon = table.getElementsByTagName('th')[sortColumn].firstElementChild.innerHTML;
  if (icon === 'expand_more' || icon === 'unfold_more')
    icon = 'expand_less';
  else
    icon = 'expand_more';
  table.getElementsByTagName('th')[sortColumn].firstElementChild.innerHTML = icon;
  var newTableBody = document.createElement("tbody");
  for (var i = 0, len = arrayOfRows.length; i < len; i++) {
    newTableBody.appendChild(rows[arrayOfRows[i].oldIndex].cloneNode(true));
  }
  table.replaceChild(newTableBody, tbody);
} // function SortTable()

function CompareRowOfPrios(a, b) {
  let prios = ['low', 'high'];
  let aval = prios.indexOf(a.value.toLowerCase());
  let bval = prios.indexOf(b.value.toLowerCase());
  return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfPrios()

function CompareRowOfStates(a, b) {
  let states = ['done', 'doing', 'todo'];
  let aval = states.indexOf(a.value.toLowerCase());
  let bval = states.indexOf(b.value.toLowerCase());
  return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfStates()

function CompareRowOfText(a, b) {
  var aval = a.value;
  var bval = b.value;
  return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfText()

function CompareRowOfNumbers(a, b) {
  var aval = /\d/.test(a.value) ? parseFloat(a.value) : 0;
  var bval = /\d/.test(b.value) ? parseFloat(b.value) : 0;
  return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfNumbers()
