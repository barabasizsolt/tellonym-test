# Tellonym Frontend

## Installation
Make sure the correct node and ruby versions are installed.
The `i` script installs the native dependencies.

```sh
nvm install
yarn install
```

## Usage

```sh
yarn workspace @tellonym/web run watch
```

## Mocked API

- https://api.tnym.de/userinterview POST { field1: string, field2: string }

## License

# ---- ASSIGNMENT 3 ----

## Experiment Structure

An experiment consists of:
- **Experiment ID** (unique identifier)
- **Feature Flags** (one or more toggles controlling feature activation)
- **Variants** (multiple groups to compare, including a control group)
- **Targeting Rules** (optional conditions such as user demographics, device type, region, etc.)
- **Traffic Allocation** (percentage distribution of users into different variants)
- **Start and End Dates** (time constraints for running the experiment)

## Experiment Lifecycle

1. **Experiment Definition & Configuration**
   - Created and stored in an internal A/B testing management system.
   - Can be modified dynamically (except for feature flag behavior).
   - Includes traffic allocation and targeting parameters.
2. **User Assignment Logic**
   - Users are assigned to a variant at the time of first encountering the experiment.
   - Assignment is deterministic (e.g., hashing user ID + experiment ID).
   - Stored persistently (server-side or locally on the client) to ensure users always receive the same variant.
3. **Feature Flag Handling**
   - Feature flags linked to experiments are controlled via the backend but require a client update for implementation.
   - The client reads the feature flag configuration and enables/disables features accordingly.
4. **Experiment Delivery**
   - The backend dynamically sends experiment assignments to the client.
   - If an experiment is active, the client checks the assigned variant and enables corresponding feature flags.
5. **Data Collection & Analysis**
   - The client sends event logs (e.g., feature usage, user behavior) tagged with experiment ID and variant.
   - Data is aggregated for statistical analysis.

## Handling Experiment Changes Without a Client Update

- **Backend Management**: Experiment definitions (variants, traffic allocation, targeting rules) are editable via a backend dashboard.
- **Real-Time Experiment Assignments**: Users are dynamically assigned on the server side or during app initialization.
- **Controlled Rollout**: Traffic allocation can be adjusted in real time without modifying the client.

## Summary

- The **backend manages** experiment definitions, user assignments, and data collection.
- The **client only needs to respect assigned variants** and apply feature flags.
- **No client update is required** for modifying traffic allocation, assignments, or targeting rules.
- **Feature flags require a client update** to implement the behavior change.
