const worker = {
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};

export default worker;
