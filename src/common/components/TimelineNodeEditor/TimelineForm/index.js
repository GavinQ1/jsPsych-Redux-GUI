import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import { labelStyle } from '../TrialForm/TrialFormItem';
import { nullToStr } from '../../../utils';
import TimelineVariableTable from '../../../containers/TimelineNodeEditor/TimelineForm/TimelineVariableTableContainer';
import CodeEditor from '../../CodeEditor';
import {
  cyan500 as trueColor,
  pink500 as falseColor
} from 'material-ui/styles/colors';

const SelectLableColor = (flag) => (flag ? trueColor : falseColor);

class TimelineForm extends React.Component {
	render(){
		return (
			<div className="TimelineForm">
				<TimelineVariableTable />
				<div className="Trial-Form-Item-Container">
			    	<SelectField 
						value={this.props.randomize}
						onChange={(event, index, value) => { this.props.setRandomize(value)}}
						fullWidth
						labelStyle={{color: SelectLableColor(this.props.randomize)}}
	          			selectedMenuItemStyle={{color: SelectLableColor(this.props.randomize)}}
						floatingLabelFixed={true}
						floatingLabelText="Randomize Order"
					>
						<MenuItem value={true}
							primaryText="True" />
						<MenuItem value={false}
							primaryText="False" />
					</SelectField>
			  	</div>
				<div className="Trial-Form-Item-Container">
			    	<SelectField 
						value={this.props.samplingType}
						onChange={this.props.setSampling} 
						fullWidth
						floatingLabelFixed={true}
						floatingLabelText="Sampling method"
					>
						<MenuItem value="with-replacement"
							primaryText="with-replacement" />
						<MenuItem value="without-replacement"
							primaryText="without-replacement" />
						<MenuItem value="fixed-repititions"
							primaryText="fixed-repititions" />
						<MenuItem value="custom"
							primaryText="custom" />
					</SelectField>
			  	</div>
			  	<div className="Trial-Form-Item-Container">
			  		<TextField
						id="Timeline_SampleSize_Input"
						value={nullToStr(this.props.samplingSize)}
						fullWidth={true}
						onChange={(event, newVal) => this.props.setSampleSize(newVal)} 
						type="number"
						floatingLabelFixed={true}
						floatingLabelText="Sample size"
					/>
			  	</div>
			  	<div className="Trial-Form-Item-Container">
			  		<TextField 
						id="Timeline_Repetitions_Input"
						fullWidth={true}
						value={(this.props.repetitions) ? this.props.repetitions : ""}
						onChange={this.props.setRepetitions} 
						type="number"
						floatingLabelFixed={true}
						floatingLabelText="Repetitions"
					/>
			  	</div>

				<div style={{display: 'flex', width: "100%"}} >
					<p
						className="Trial-Form-Label-Container"
					    style={labelStyle}
					>
					    Loop function:
					</p>
					<div className="Trial-Form-Content-Container">
						<CodeEditor
							initCode={this.props.loopFunction.code}
							title="Loop function"
							submitCallback={this.props.setLoopFunction}
						/>
					</div>
				</div>
				<div style={{display: 'flex', width: "100%"}} >
					<p
						className="Trial-Form-Label-Container"
					    style={labelStyle}
					>
					    Conditional function:
					</p>
					<div className="Trial-Form-Content-Container">
						<CodeEditor
							initCode={this.props.conditionalFunction.code}
							title="Condition function"
							submitCallback={this.props.setConditionFunction}
						/>
					</div>
				</div>
			</div>
		)
	}
}

export default TimelineForm;
