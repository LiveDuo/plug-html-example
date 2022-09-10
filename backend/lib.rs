
#[ic_cdk_macros::query]
fn query_call() -> String {
    ic_cdk::println!("Hello!");
	return "Hello".to_string();
}

#[ic_cdk_macros::update]
fn update_call() {
    ic_cdk::println!("update_call!");
}
