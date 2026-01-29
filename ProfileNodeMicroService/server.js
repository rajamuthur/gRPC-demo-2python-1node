const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "../proto/services.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition).services;

/* ---------- Implementation ---------- */
function CreateLoginProfile(call, callback) {
  const { user_id, username } = call.request;

  console.log("🧑 ProfileService (Node) received request");
  console.log("   user_id:", user_id);
  console.log("   username:", username);

  callback(null, {
    success: true,
    message: "Profile updated in Node.js service",
  });
}

/* ---------- Server ---------- */
const server = new grpc.Server();
server.addService(proto.ProfileService.service, {
  CreateLoginProfile,
});

server.bindAsync(
  "0.0.0.0:50053",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("🚀 ProfileService (Node) running on port 50053");
    server.start();
  }
);
