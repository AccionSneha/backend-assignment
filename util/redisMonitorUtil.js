const redis = require("redis");
const { dateTime, moment } = require("./momentUtil");

/**
 * Initialises redis instance for provided configuraton
 */
initRedis = async (host, port, password, db) => {
  return new Promise((resolve, reject) => {
    let client = redis.createClient({
      host: host,
      port: port,
      password: password,
    });

    client.on("error", (error) => {
      console.log("error in redis connection", error);
      reject(error);
    });

    client.on("ready", () => {
      console.log("redis server is connected successfully.");
      resolve(client);
    });
  });
};

/**
 * Parse server information to float.
 * @param {*} info : server information for client.server_info
 */
const parseServerInfo = (info) => {
  info.config_file = "";
  info.redis_git_sha1 = parseFloat(info.redis_git_sha1);
  info.redis_git_dirty = parseFloat(info.redis_git_dirty);
  info.arch_bits = parseFloat(info.arch_bits);
  info.process_id = parseFloat(info.process_id);
  info.tcp_port = parseFloat(info.tcp_port);
  info.uptime_in_seconds = parseFloat(info.uptime_in_seconds);
  info.uptime_in_days = parseFloat(info.uptime_in_days);
  info.hz = parseFloat(info.hz);
  info.lru_clock = parseFloat(info.lru_clock);
  info.connected_clients = parseFloat(info.connected_clients);
  info.client_longest_output_list = parseFloat(info.client_longest_output_list);
  info.client_biggest_input_buf = parseFloat(info.client_biggest_input_buf);
  info.blocked_clients = parseFloat(info.blocked_clients);
  info.used_memory = parseFloat(info.used_memory);
  info.used_memory_rss = parseFloat(info.used_memory_rss);
  info.used_memory_peak = parseFloat(info.used_memory_peak);
  info.total_system_memory = parseFloat(info.total_system_memory);
  info.used_memory_lua = parseFloat(info.used_memory_lua);
  info.maxmemory = parseFloat(info.maxmemory);
  info.mem_fragmentation_ratio = parseFloat(info.mem_fragmentation_ratio);
  info.loading = parseFloat(info.loading);
  info.rdb_changes_since_last_save = parseFloat(
    info.rdb_changes_since_last_save
  );
  info.rdb_bgsave_in_progress = parseFloat(info.rdb_bgsave_in_progress);
  info.rdb_last_save_time = parseFloat(info.rdb_last_save_time);
  info.rdb_last_bgsave_time_sec = parseFloat(info.rdb_last_bgsave_time_sec);
  info.rdb_current_bgsave_time_sec = parseFloat(
    info.rdb_current_bgsave_time_sec
  );
  info.aof_enabled = parseFloat(info.aof_enabled);
  info.aof_rewrite_in_progress = parseFloat(info.aof_rewrite_in_progress);
  info.aof_rewrite_scheduled = parseFloat(info.aof_rewrite_scheduled);
  info.aof_last_rewrite_time_sec = parseFloat(info.aof_last_rewrite_time_sec);
  info.aof_current_rewrite_time_sec = parseFloat(
    info.aof_current_rewrite_time_sec
  );
  info.total_connections_received = parseFloat(info.total_connections_received);
  info.total_commands_processed = parseFloat(info.total_commands_processed);
  info.instantaneous_ops_per_sec = parseFloat(info.instantaneous_ops_per_sec);
  info.total_net_input_bytes = parseFloat(info.total_net_input_bytes);
  info.total_net_output_bytes = parseFloat(info.total_net_output_bytes);
  info.instantaneous_input_kbps = parseFloat(info.instantaneous_input_kbps);
  info.instantaneous_output_kbps = parseFloat(info.instantaneous_output_kbps);
  info.rejected_connections = parseFloat(info.rejected_connections);
  info.sync_full = parseFloat(info.sync_full);
  info.sync_partial_ok = parseFloat(info.sync_partial_ok);
  info.sync_partial_err = parseFloat(info.sync_partial_err);
  info.expired_keys = parseFloat(info.expired_keys);
  info.evicted_keys = parseFloat(info.evicted_keys);
  info.keyspace_hits = parseFloat(info.keyspace_hits);
  info.keyspace_misses = parseFloat(info.keyspace_misses);
  info.pubsub_channels = parseFloat(info.pubsub_channels);
  info.pubsub_patterns = parseFloat(info.pubsub_patterns);
  info.latest_fork_usec = parseFloat(info.latest_fork_usec);
  info.migrate_cached_sockets = parseFloat(info.migrate_cached_sockets);

  info.connected_slaves = parseFloat(info.connected_slaves);
  info.master_repl_offset = parseFloat(info.master_repl_offset);
  info.repl_backlog_active = parseFloat(info.repl_backlog_active);
  info.repl_backlog_size = parseFloat(info.repl_backlog_size);
  info.repl_backlog_first_byte_offset = parseFloat(
    info.repl_backlog_first_byte_offset
  );
  info.repl_backlog_histlen = parseFloat(info.repl_backlog_histlen);
  info.used_cpu_sys = parseFloat(info.used_cpu_sys);
  info.used_cpu_user = parseFloat(info.used_cpu_user);
  info.used_cpu_sys_children = parseFloat(info.used_cpu_sys_children);
  info.used_cpu_user_children = parseFloat(info.used_cpu_user_children);
  info.cluster_enabled = parseFloat(info.cluster_enabled);
};

new_request = async (host, port, password, charset = "utf8") => {
  let redis_rst = {};

  try {
    let start = moment.now();
    let client = await initRedis(host, port, password);

    let info = client.server_info;

    /**
     * Parse server information to float.
     * @param {*} info : server information for client.server_info
     */
    parseServerInfo(info);

    let end = moment.now();
    // info["get_time"] = (end - start) * 1000;
    info["get_time"] = end - start;

    redis_rst["success"] = 1;
    redis_rst["data"] = info;
  } catch (e) {
    redis_rst["success"] = 0;
    redis_rst["data"] = "error";
  }

  return redis_rst;
};

class RedisMonitor {
  ping = async (host, port, password, charset = "utf8") => {
    let redis_rst = {};
    if (host && port) {
      try {
        let client = await initRedis(host, port, password);
        client.info();

        redis_rst["success"] = 1;
        redis_rst["data"] = "Ping success!";
      } catch (e) {
        redis_rst["success"] = 0;
        redis_rst["data"] = "Ping error!";
      }
      return redis_rst;
    } else {
      return { success: 0, data: "Parameter error!" };
    }
  };

  get_info = async (host, port, password, charset = "utf8") => {
    let redis_rst = {};
    if (host && port) {
      redis_rst = await new_request(host, port, password, charset);
    } else {
      redis_rst = { success: 0, data: "Parameter error!" };
    }
    return redis_rst;
  };
}

module.exports = {
  RedisMonitor,
  initRedis,
};
