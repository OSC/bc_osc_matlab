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

function convert_timelimit(TIMELIMIT) {
    const time_split = TIMELIMIT.split(/[-:]/).map(Number);
    var time_in_hours = 0;
    if (time_split.length === 3) {
        time_in_hours = time_split[0] + time_split[1]/60 + time_split[2]/3600
    } else if (time_split.length === 4) {
        time_in_hours = time_split[0] * 24 + time_split[1] + time_split[2]/60 + time_split[3]/3600
    }
    return time_in_hours
}


function convert_gpu_partitions(GRES) {
    const gpu_options = [];
    if (GRES.length !== 0) {
        for (const ind_gres of GRES) {
            const gpu_info = ind_gres.split(':');
            for (let i = 1; i <= Number(gpu_info.slice(-1)); i++) {
                gpu_options.push([gpu_info[0], gpu_info[1], i].join(':'));
            }
        }
    }
    return [...new Set(gpu_options)]
}

function get_associations() {
  const raw_data = $('#batch_connect_session_context_raw_data').val();
  const raw_groups_data = $('#batch_connect_session_context_raw_group_data').val().split(",").filter(x => x);
  const general_access_allocations = raw_groups_data.filter(x => x.includes("p"))
  const assocs = [];
  // Obtain all unique partition and allocation combinations
  for (const assoc of raw_data.split(" ").filter(x => x)) {
    const [PARTITION, GROUPS, TIMELIMIT, GRES, MEMORY, CPUS] = assoc.split("|");
    const groups = raw_groups_data.filter(value => GROUPS.includes(value));
    if (PARTITION.includes("a9009")) {
        assocs.push({ partition: PARTITION,
                      account: "a9009",
                      maxtime : convert_timelimit(TIMELIMIT),
                      gpus: GRES,
                      max_mem: MEMORY,
                      max_cpus: CPUS});
    } else if (GROUPS.includes("all") && (general_access_allocations.length !== 0)) {
        for (let gen_access of general_access_allocations) {
            assocs.push({ partition: PARTITION.replace('*', ''),
                          account: gen_access,
                          maxtime : convert_timelimit(TIMELIMIT),
                          gpus: GRES,
                          max_mem: MEMORY,
                          max_cpus: CPUS});
        }
    } else if (groups.length !== 0) {
        for (const group of groups) {
            assocs.push({ partition: PARTITION,
                          account: group,
                          maxtime : convert_timelimit(TIMELIMIT),
                          gpus: GRES,
                          max_mem: MEMORY,
                          max_cpus: CPUS});
        }
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
function toggle_gres_value_field_visibility(assocs) {
  const gpu_partitions = [...new Set((assocs.filter(({ gpus }) => gpus !== "(null)")).map(({ gpus }) => gpus))];
  
  toggle_visibility_of_form_group(
    '#batch_connect_session_context_gres_value',
    gpu_partitions.length !== 0);

  replace_options($("#batch_connect_session_context_gres_value"), convert_gpu_partitions(gpu_partitions));
}

function toggle_number_of_nodes_visibility() {
  toggle_visibility_of_form_group(
    '#number_of_nodes',
    $("#batch_connect_session_context_request_more_than_one_node").is(':checked'));
}

function set_available_accounts() {
  let assocs = get_associations();
  const selected_partition = $("#batch_connect_session_context_slurm_partition").val();
  assocs = assocs.filter(({ partition }) => partition === selected_partition);
  const accounts = [...new Set(assocs.map(({ account }) => account))];
  replace_options($("#batch_connect_session_context_slurm_account"), accounts);
  return assocs
}

function set_min_max(assocs) {
  const max_walltime = [...new Set((assocs.map(({ maxtime }) => maxtime)))][0];
  const max_mem = Number([...new Set((assocs.map(({ max_mem }) => max_mem)))][0].replace('+', ''));

  if (max_walltime === 0) {
    $("#batch_connect_session_context_bc_num_hours").attr({
       "max" : "",
       "min" : 1,
    });
  } else {
    $("#batch_connect_session_context_bc_num_hours").attr({
       "max" : max_walltime,
       "min" : 1,
    });
  };

  if (max_mem > 264000) {
    $("#memory_per_node").attr({
       "max" : 2000,
       "min" : 1,
    });
  } else {
    $("#memory_per_node").attr({
       "max" : 243,
       "min" : 1,
    });
  }

}

function update_available_options() {
  let assocs = set_available_accounts();
  return assocs 
}

function update_min_max(assocs) {
  set_min_max(assocs);
}

/**
 * Sets the change handler for the slurm partition select.
 */
function set_slurm_partition_change_handler() {
  let slurm_partition = $("#batch_connect_session_context_slurm_partition");
  slurm_partition.change(() => {
    let assocs = update_available_options();
    toggle_gres_value_field_visibility(assocs);
    update_min_max(assocs);
  });
}

function set_more_than_one_node_change_handler() {
  let request_more_than_one_node = $("#batch_connect_session_context_request_more_than_one_node");
  request_more_than_one_node.click(() => {
    toggle_number_of_nodes_visibility();
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
  const partitions = [...new Set(assocs.map(({ partition }) => partition))];
  replace_options($("#batch_connect_session_context_slurm_partition"), partitions);
}

/**
 *  Install event handlers
 */
$(document).ready(function() {
  set_available_partitions();
  // Update available options appropriately
  let assocs = update_available_options();
  // Ensure that fields are shown or hidden based on what was set in the last session
  toggle_gres_value_field_visibility(assocs);
  update_min_max(assocs);
  toggle_number_of_nodes_visibility();
  set_slurm_partition_change_handler();
  set_slurm_account_change_handler();
  set_more_than_one_node_change_handler();
});

