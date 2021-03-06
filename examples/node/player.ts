import * as state from "@steelbreeze/state";

// create the state machine model elements
const model = new state.StateMachine ("model");
const initial = new state.PseudoState ("initial", model, state.PseudoStateKind.Initial);
const operational = new state.State ("operational", model);
const flipped = new state.State ("flipped", model);
const finalState = new state.State ("final", model);
const deepHistory = new state.PseudoState ("history", operational, state.PseudoStateKind.DeepHistory);
const stopped = new state.State ("stopped", operational);
const active = new state.State ("active", operational).entry (() => console.log("Engage head")).exit (() => console.log("Disengage head"));
const running = new state.State ("running", active).entry (() => console.log("Start motor")).exit (() => console.log("Stop motor"));
const paused = new state.State ("paused", active);

// create the state machine model transitions
initial.to (operational);
deepHistory.to (stopped);
stopped.to (running).when ((i, s) => s === "play");
active.to (stopped).when ((i, s) => s === "stop");
running.to (paused).when ((i, s) => s === "pause");
paused.to (running).when ((i, s) => s === "play");
operational.to (flipped).when ((i, s) => s === "flip");
flipped.to (operational).when ((i, s) => s === "flip");
operational.to (finalState).when ((i, s) => s === "off");

// create a new state machine instance (this stores the active state configuration, allowing many instances to work with a single model)
let instance = new state.JSONInstance("player");

// initialse the state machine instance (also initialises the model if not already initialised explicitly or via another instance)
model.initialise(instance);

// send messages to the state machine to cause state transitions
model.evaluate(instance, "play");
model.evaluate(instance, "pause");
model.evaluate(instance, "stop");

console.log(instance.toJSON());