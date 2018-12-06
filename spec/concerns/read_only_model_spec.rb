require 'spec_helper'
 
xdescribe 'ReadOnlyModel' do
  before do
    # build_model :read_only_fus do
    #   string :field1
    # end

    stub_model("ReadOnlyFu", field1: "Fred")
 
    # To create an instance for testing, you must create it first...
    @instance = ReadOnlyFu.create(field1: 'some text')
    # ... before applying the readonly module!
    class ReadOnlyFu
      include ReadOnlyModel
    end
  end
 
  it 'raises error on create' do
    expect{ReadOnlyFu.create}.to raise_error(ActiveRecord::ReadOnlyRecord)
  end
 
  it 'raises error on save' do
    expect{@instance.save}.to raise_error(ActiveRecord::ReadOnlyRecord)
  end
 
  it 'raises error on update_attributes' do
    expect{@instance.update_attributes(field1: 'other text')}.to raise_error(ActiveRecord::ReadOnlyRecord)
  end
 
  it 'raises error on update_attribute' do
    # Raises ActiveRecordError, not ReadOnlyRecord.
    expect{@instance.update_attribute(:field1, 'other text')}.to raise_error(ActiveRecord::ActiveRecordError)
  end
 
  it 'raises error on update_column' do
    # Raises ActiveRecordError, not ReadOnlyRecord.
    expect{@instance.update_column(:field1, 'other text')}.to raise_error(ActiveRecord::ActiveRecordError)
  end
 
  it 'raises error on delete' do
    expect{@instance.delete}.to raise_error(ActiveRecord::ReadOnlyRecord)
  end
 
  it 'raises error on destroy' do
    expect{@instance.destroy}.to raise_error(ActiveRecord::ReadOnlyRecord)
  end
 
end