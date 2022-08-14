import {IInputs, IOutputs} from "./generated/ManifestTypes";
import noUiSlider = require("nouislider");

export class RangeSliderControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	// Reference to the control container HTMLDivElement
	// This element contains all elements of our custom control example
	private _container: HTMLDivElement;

	// Reference to ComponentFramework Context object
	private _context: ComponentFramework.Context<IInputs>;

	private _refreshData: EventListenerOrEventListenerObject;

	// Flag if control view has been rendered
	private _controlViewRendered: boolean;

	// PCF framework delegate which will be assigned to this object. Called whenever any update happens. 
	private _notifyOutputChanged: () => void;

/*	// Common PowerApps parameters for presentation adjustment
	private _paddingTop: number;
	private _paddingBottom: number;
	private _paddingLeft: number;
	private _paddingRight: number;
	private _minHeight: number; // add/remove from this depending on settings for Value and Scale display
*/	// Parameters for the control setup to be passed to noUiSlider
	private _startLowerValue: number;
	private _startUpperValue: number;
	private _rangeLowerValue: number;
	private _rangeUpperValue: number;
	private _toolTips: boolean;
	private _stepValue: number;		// (ref: step)
//	private _snapSwitch: boolean;		// (ref: snap)
//	private _pipsDensity: number;
//	private _pipsMode: 
	private _behaviourString: string;
	// Parameters for noUiSlider specific presentation tweaks
	private _handlePadding: number;		// limits how close to the slider edges the handles can be (ref: padding)
	// Define outputs
	private _lowerValue: number;
	private _upperValue: number;
	
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void {
		this._controlViewRendered = false;
		this._context = context;
		this._container = container;
		this._notifyOutputChanged = notifyOutputChanged;

		this._container = document.createElement("div");
		this._container.classList.add("dwcrm-slider-wrapper");
		container.appendChild(this._container);
	}

	public refreshData(values:string[], handle:number): void {
		console.log("refreshData");
		let value:string = values[handle];

		if(handle == 0){
			this._lowerValue = parseFloat(value);
		} else {
			this._upperValue = parseFloat(value);
		}
		this._notifyOutputChanged();
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		if(!this._controlViewRendered) {
			// Render the control
			noUiSlider.create(this._container, {
/*				start: [this._context.parameters.StartLowerValue.raw || 20, this._context.parameters.StartUpperValue.raw || 80],
				range: {
					'min': this._context.parameters.RangeLowerValue.raw || 0,
					'max': this._context.parameters.RangeUpperValue.raw || 100
				*/
				start: [10, 80],
				range: {
					'min': 0,
					'max': 100
				},				
				step: this._context.parameters.StepValue.raw || 10,
				direction: "ltr",
				connect: [false, true, false],
				tooltips: this._context.parameters.ToolTips.raw || true,
				behaviour: this._context.parameters.BehaviourString.raw || "drag-tap-smooth-steps",

			});
			this._lowerValue = this._context.parameters.StartLowerValue.raw || 0;
			this._upperValue = this._context.parameters.StartUpperValue.raw || 100;

			// @ts-ignorecd 
			this._container.noUiSlider.on('update', this.refreshData);

			this._controlViewRendered = true;
		}
	}


	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		return { 
            SelectedUpperValue: this._upperValue, 
           	SelectedLowerValue: this._lowerValue 
        };
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}
}
