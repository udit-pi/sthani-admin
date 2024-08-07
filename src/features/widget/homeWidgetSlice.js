import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "../message/messageSlice";
import HomeWidgetService from "../../services/homeWidgetService";


// import CategoryService from "../../services/category.service";

let initialState = {
    widgets: [],
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 1,
    
  };



export const addWidget = createAsyncThunk(
    "home/addwidget",
    async (widgetData,thunkAPI) => {
      try {
      //  console.log(catData)
        const res = await HomeWidgetService.savehomeWidget(widgetData);
      //   thunkAPI.dispatch(setMessage(data.message));
        return res;
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue();
      }
    }
);

export const fetchAllwidget = createAsyncThunk(
  "home/fetchWidgets",
  async (thunkAPI) => {
    try {
    //  console.log(catData)
      const res = await HomeWidgetService.getAllWidgets();
    //   thunkAPI.dispatch(setMessage(data.message));
      return res;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);


export const fetchWidgetById = createAsyncThunk(
  "home/fetchWidget",
  async ({id},thunkAPI) => {
    try {
     
      const data = await HomeWidgetService.getWidget(id);
    //   thunkAPI.dispatch(setMessage(data.message));
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);


export const updateWidget = createAsyncThunk(
  "home/updateWidget",
  async ({id,values},thunkAPI) => {
    try {
     
      const data = await HomeWidgetService.updateWidgetById(id,values);
    //   thunkAPI.dispatch(setMessage(data.message));
     console.log(data);
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const deleteWidget = createAsyncThunk(
  "home/deleteWidget",
  async ({id},thunkAPI) => {
    try {
    //   console.log(id)
    //  console.log(updateData)
      const res = await HomeWidgetService.deleteWidgetById(id);
    //   thunkAPI.dispatch(setMessage(data.message));
      return res;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);




const homeWidgetSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllwidget.fulfilled, (state, action) => {
        state.widgets = action.payload;
      })
      .addCase(updateWidget.fulfilled, (state, action) => {
        const index = state.widgets.findIndex(widget => widget.id === action.payload.id);
        if (index !== -1) {
          state.widgets[index] = action.payload;
        }
      });
  }
});

export const updateWidgetStatus = createAsyncThunk(
  "home/updateWidgetStatus",
  async ({ id, is_active }, thunkAPI) => {
      try {
          const data = await HomeWidgetService.updateWidgetStatus(id, is_active);
          return data;
      } catch (error) {
          const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
          thunkAPI.dispatch(setMessage(message));
          return thunkAPI.rejectWithValue();
      }
  }
);


export default homeWidgetSlice.reducer
