'use strict'

/**
 *   Toggle the visibility of a form group
 *  
 *   @param      {string}    form_id  The form identifier
 *   @param      {boolean}   show     Whether to show or hide
 */
function toggle_visibility_of_form_group(form_id, show) {
  let form_element = $(form_id);
  let parent = form_element.parent();

  if(show) {
    parent.show();
  } else {
    form_element.val('');
    parent.hide();
  }
}

function get_associations() {
  const raw_data = $('#batch_connect_session_context_raw_data').val();
  const assocs = [];
  for (const assoc of raw_data.split(" ").filter(x => x)) {
    const [account, qos_list] = assoc.split("|");
    if (qos_list.includes("normal")) {
        assocs.push({ partition: 'short', account});
        assocs.push({ partition: 'normal', account});
        assocs.push({ partition: 'long', account});
        assocs.push({ partition: 'gengpu', account});
        assocs.push({ partition: 'genhimem', account});
    } else if (qos_list.includes("buyin")) {
        assocs.push({ partition: account, account });
    }
  }
  return assocs;
}

function replace_options($select, new_options) {
  const old_selection = $select.val();
  $select.empty();
  new_options.sort().map(option => $select.append($("<option></option>").attr("value", option).text(option)));
  if (new_options.includes(old_selection)) {
    $select.val(old_selection);
  }
}

/**
 *  Toggle the visibility of the GRES Value field
 */
function toggle_gres_value_field_visibility() {
  let slurm_partition = $("#batch_connect_session_context_slurm_partition");
  let gpu_partitions = [
    'gengpu'
  ];

  toggle_visibility_of_form_group(
    '#batch_connect_session_context_gres_value',
    gpu_partitions.includes(slurm_partition.val()));
}

function set_available_accounts() {
  let assocs = get_associations();
  const selected_partition = $("#batch_connect_session_context_slurm_partition").val();
  assocs = assocs.filter(({ partition }) => partition === selected_partition);
  const accounts = assocs.map(({ account }) => account);
  replace_options($("#batch_connect_session_context_slurm_account"), accounts);
}

function update_available_options() {
  set_available_accounts();
}

/**
 * Sets the change handler for the slurm partition select.
 */
function set_slurm_partition_change_handler() {
  let slurm_partition = $("#batch_connect_session_context_slurm_partition");
  slurm_partition.change(() => {
    toggle_gres_value_field_visibility();
    update_available_options();
  });
}

/**
 * Sets the change handler for the slurm account select.
 */
function set_slurm_account_change_handler() {
  const slurm_account = $("#batch_connect_session_context_slurm_account");
  slurm_account.change(() => {
    update_available_options();
  });
}

function set_available_partitions() {
  const assocs = get_associations();
  const allpartitions = [...new Set(assocs.map(({ partition }) => partition))];
  // Skip on partition value of cortex as that is an obsolete partition now
  const non_existent_partition = 'cortex';
  const partitions = allpartitions.filter(partition => partition !== non_existent_partition);
  replace_options($("#batch_connect_session_context_slurm_partition"), partitions);
}

/**
 *  Install event handlers
 */
$(document).ready(function() {
  set_available_partitions();
  // Ensure that fields are shown or hidden based on what was set in the last session
  toggle_gres_value_field_visibility();
  // Update available options appropriately
  update_available_options();
  set_slurm_partition_change_handler();
  set_slurm_account_change_handler();
});

